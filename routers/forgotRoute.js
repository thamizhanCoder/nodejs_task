const express = require("express");
const forgotRoute = require("../controllers/forgotPasswordController");

const router = express.Router();

router.post("/register", forgotRoute.registerUser);

router.post("/forgot-password", forgotRoute.forgotPassword);

router.post("/reset-password", forgotRoute.resetPassword);


module.exports = router;