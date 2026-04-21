const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const { register, login, forgotPassword, resetPassword, forgotUsername, verifyLogin, getMyProfile } = require("../controllers/auth.controller");

const {
  updateProfile,
  updateBusiness,
  changePassword,
} = require("../controllers/user.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/forgot-username", forgotUsername);
router.post("/verify-login", verifyLogin); // for 2FA verification
router.get("/me",protect, getMyProfile); // protected route to get user profile

// User profile routes
router.put("/update-profile", protect, updateProfile);
router.put("/update-business", protect, updateBusiness);
router.put("/change-password", protect, changePassword);

module.exports = router;