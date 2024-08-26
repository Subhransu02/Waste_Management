const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", userController.getHomepage);
router.get("/signup", userController.getSignupPage);
router.get("/login", userController.getLoginPage);
router.get("/contactUs", userController.getcontactUsPage);
router.post('/contact', userController.submitcontact);
module.exports = router;