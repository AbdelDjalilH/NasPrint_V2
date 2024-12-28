const express = require("express");
const { login, register, verifyOtp } = require("../controllers/authController");
const { checkLoginDatas, checkRegisterDatas } = require("../services/checkDatas");

const router = express.Router();

router.post("/login", checkLoginDatas, login);
router.post("/register", checkRegisterDatas, register);
router.post("/verify-otp", verifyOtp);

router.use((req, res) => {
    console.error("Route inconnue :", req.originalUrl);
    res.status(404).json({ message: "Route non trouvée" });
});

module.exports = router;

