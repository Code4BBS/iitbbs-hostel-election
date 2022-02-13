const { OAuth2Client } = require("google-auth-library");
const controller = require("./controller");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const config = require("../utils/config");

const client = new OAuth2Client(config.CLIENT_ID);

const checkOrg = (email) => {
  const index = email.indexOf("@");
  const domain = email.substr(index);
  if (domain !== "@iitbbs.ac.in") return false;
  return true;
};

const googleLogin = catchAsync(async (req, res, next) => {
  const { tokenId, hostel } = req.body;
  if (!tokenId) {
    return next(new AppError("User not logged in.", 403));
  }
  if (!hostel || !["BHR", "SHR", "RHR", "MHR", "GHR"].includes(hostel)) {
    throw new AppError("No hostel present", 400);
  }
  client
    .verifyIdToken({ idToken: tokenId, audience: config.CLIENT_ID })
    .then(async (response) => {
      const { email, email_verified } = response.payload;

      if (email_verified) {
        if (!checkOrg(email))
          return next(
            new AppError("Please use an email provided by IIT Bhubaneswar", 403)
          );

        const isEligibleToVote = await controller.authCheck(hostel, email);

        if (isEligibleToVote) {
          res.status(200).json({
            status: "success",
            message: "Logged in successfully, allowed to vote",
          });
        }
      }
    })
    .catch((err) => {
      throw new AppError(err.message, err.statusCode ? err.statusCode : 401);
    });
});

module.exports = { googleLogin };
