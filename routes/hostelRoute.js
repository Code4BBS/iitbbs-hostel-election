const express = require("express");
const AppError = require("../utils/appError");
const controller = require("../controller/controller");
const authController = require("../controller/authController");

const router = express.Router();

// route for creating hostel - remove in production
router.post("/", controller.createHostel);

router.use(authController.verifyToken);

// route for voting the candidates
router.post("/vote", controller.vote);

//route for checking results
router.get("/results", controller.getResults);

module.exports = router;
