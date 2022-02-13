const express = require("express");
const AppError = require("../utils/appError");
const controller = require("../controller/controller");

const router = express.Router();

// route for creating hostel - remove in production
router.post("/", controller.createHostel);

router.use((req, res, next) => {
  if (!req.user) return next(new AppError("You are not logged in", 401));
  next();
});

// route for voting the candidates
router.post("/vote", controller.vote);

//route for checking results
router.get("/results", controller.getResults);

module.exports = router;
