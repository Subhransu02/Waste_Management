const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");
const driverAuthMiddleware = require("../middleware/driverAuthMiddleware");


router.get("/", driverController.getDriverLogin);
router.post("/login_process", driverController.loginDriver);
router.get("/dashboard", driverAuthMiddleware.isDriverLoggedIn, driverController.getDriverDashboard);
router.get("/logout", driverController.logoutDriver);

module.exports = router;