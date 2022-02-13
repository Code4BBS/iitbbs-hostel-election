const express = require("express");
const controller = require("../controller/controller");
const authController = require("../controller/authController");

const router = express.Router();

router.post("/auth/login", authController.googleLogin);

//eligible - check if user is eligible to vote : being in hostel and has voted already.
router.get("/eligible", controller.checkEligibility);

module.exports = router;
