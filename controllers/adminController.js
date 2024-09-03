const bcrypt = require("bcrypt");
const _db = require("../config/db");
const { ObjectId } = require("mongodb");

exports.redirectToLogin = (req, res) => {
    res.redirect("/admin/login");
};

exports.getLoginPage = (req, res) => {
    if (req.session.isAdmin) {
        res.redirect("/admin/dashboard");
    } else {
        res.render("admin/adminlogin.ejs");
    }
};

exports.loginAdmin = (req, res) => {
    let { email, password } = req.body;
    let mail = "admin@example.com";
    let hashed_pass = "$2b$10$MmYRPyzFDEUjaEp1iYSdveyvR.v1n.jfoS6qSDQHx3GUEVWs4x8z6"; // Admin@123

    if (email === mail && bcrypt.compareSync(password, hashed_pass)) {
        req.session.isAdmin = true;
        res.redirect("/admin/dashboard");
    } else {
        res.send("Email or Password is wrong");
    }
};

exports.getAdminDashboard = async (req, res) => {
    let db = _db.getDb();

    let result = await db
        .collection("requests")
        .find(
            {},
            {
                projection: {
                    _id: false,
                    request_type: true,
                    status: true,
                    assignedDriver: true,
                },
            }
        )
        .toArray();

    let driverData = await db
        .collection("drivers")
        .find(
            {},
            {
                projection: {
                    _id: false,
                    vehicleType: true,
                },
            }
        )
        .toArray();

    let userData = await db
        .collection("users")
        .find(
            {},
            {
                projection: {
                    _id: false,
                    name: true,
                },
            }
        )
        .toArray();

    const total_requests = result.length;
    const total_pending = result.filter((item) => item.status === "pending").length;
    const total_resolved = result.filter((item) => item.status === "resolved").length;
    const total_pickup_request = result.filter((item) => item.request_type === "Pickup").length;
    const total_complaint_request = result.filter((item) => item.request_type === "Complaint").length;
    const total_recycling_request = result.filter((item) => item.request_type === "Recycling").length;
    const total_other_request = result.filter((item) => item.request_type === "Other").length;
    const total_unassigned_driver_requests = result.filter((item) => item.assignedDriver === "none").length;
    const total_users = userData.length;
    const total_drivers = driverData.length;
    const total_trucks = driverData.filter((item) => item.vehicleType === "Truck").length;
    const total_cars = driverData.filter((item) => item.vehicleType === "Car").length;
    const total_van = driverData.filter((item) => item.vehicleType === "Van").length;
    const total_motorcycle = driverData.filter((item) => item.vehicleType === "Motorcycle").length;

    res.render("admin/adminDashboard.ejs", {
        result: {
            total_requests,
            total_pending,
            total_resolved,
            total_pickup_request,
            total_complaint_request,
            total_recycling_request,
            total_other_request,
            total_unassigned_driver_requests,
            total_drivers,
            total_users,
            total_trucks,
            total_cars,
            total_van,
            total_motorcycle,
        },
    });
};




exports.logoutAdmin = (req, res) => {
    req.session.isAdmin = false;
    res.redirect("/");
};