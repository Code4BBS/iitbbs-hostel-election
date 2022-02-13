const express = require("express");
const passport = require("passport");
const controller = require("../controller/controller");

const router = express.Router();

//google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    prompt: "consent",
    scope: ["profile", "email"],
  })
);

//google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google-success",
    failureRedirect: "/",
  }),
  (req, res) => {
    req.session.save();
    console.log(req);
    res.redirect("/");
  }
);

//logout function
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//success-callback
router.get("/google-success", controller.googleSuccess);

//eligible - check if user is eligible to vote : being in hostel and has voted already.
router.get("/eligible", controller.checkEligibility);

module.exports = router;
