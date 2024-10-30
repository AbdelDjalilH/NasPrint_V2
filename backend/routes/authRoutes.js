const express = require("express");
const { login, register } = require("../controllers/authController");
const { checkLoginDatas, checkRegisterDatas } = require("../services/checkDatas");

const router = express.Router();

// Assurez-vous que la vérification des données fonctionne correctement
router.post("/login", checkLoginDatas, login);
router.post("/register", checkRegisterDatas, register);

module.exports = router;

