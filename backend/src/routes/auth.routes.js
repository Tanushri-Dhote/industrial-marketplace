const express = require("express");
const router = express.Router();

const { register, login, forgotPassword, resetPassword, forgotUsername, verifyLogin } = require("../controllers/auth.controller");


router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/forgot-username", forgotUsername);
router.post("/verify-login", verifyLogin); // for 2FA verification

module.exports = router;