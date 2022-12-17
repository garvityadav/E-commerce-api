const express = require("express");
const router = express.Router();


const { register, login, logout } = require("../controller/authController");
router.route("/logout").get(logout);
router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
