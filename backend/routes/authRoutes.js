const express = require("express");
const { login} = require("../controllers/authController");
// const {checkLoginDatas, checkRegisterDatas} = require("../services/checkDatas");

const router = express.Router();

router.post("/login", login);
// router.post("/register", checkRegisterDatas, register);

module.exports = router;
