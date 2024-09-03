const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/adminAuthMiddleware");
let session = require("express-session");


router.use(session({
    secret: "This is session secret",
    resave: false,
    saveUninitialized: false
}));


router.get("/", adminController.redirectToLogin);
router.get("/login", adminController.getLoginPage);
router.post("/login_process", adminController.loginAdmin);
router.get("/dashboard", authMiddleware.isAdminLoggedIn, adminController.getAdminDashboard);
router.get("/logout", adminController.logoutAdmin);


module.exports = router;