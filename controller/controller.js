const Hostel = require("../model/hostelModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const config = require("../utils/config");
const { getEmailsOfAHostel } = require("../config/googleSheetsSetup");

const WARDEN_EMAIL = "warden@iitbbs.ac.in";

const checkIfUserBelongsToAHostel = async (hostel, email) => {
  const emails = await getEmailsOfAHostel(hostel);

  return emails.includes(email);
};

const hasVoted = async (hostel, email) => {
  const currHostel = await Hostel.findOne({ hostel: hostel });

  if (currHostel.voted.includes(email)) return true;

  return false;
};

const authCheck = async (hostel, email) => {
  console.log("Inside authCheck");

  if (!email) {
    console.log("Email not found");
    throw new AppError("No email present", 401);
  }

  if (!hostel || !["BHR", "SHR", "RHR", "MHR", "GHR"].includes(hostel)) {
    throw new AppError("No hostel present", 400);
  }

  const userBelongsToAHostel = await checkIfUserBelongsToAHostel(hostel, email);

  if (!userBelongsToAHostel)
    throw new AppError("User not found in hostel", 403);

  const voted = await hasVoted(hostel, email);

  if (voted) {
    throw new AppError("Voter has voted already", 403);
  }

  return true;
};

const upVoteACandidate = (candidates, candidateEmail, candidatePosition) => {
  const index = candidates.findIndex(
    (candidate) =>
      candidate.email === candidateEmail &&
      candidate.position === candidatePosition
  );

  console.log(index);

  if (index >= 0) {
    candidates[index].votes = candidates[index].votes + 1;
  } else {
    throw new AppError(
      `Candidate ${candidateEmail} for ${candidatePosition} Not Found`,
      400
    );
  }
};

const googleSuccess = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("User not found", 403));
  }

  res.redirect("/election");
});

const checkEligibility = catchAsync(async (req, res, next) => {
  const { hostel } = req.body;
  const email = req.user.emails[0].value;

  const eligible = await authCheck(hostel, email);

  res.status(200).json({
    message: `User belongs to ${hostel} and has not voted yet, allow voting!`,
  });
});

const vote = catchAsync(async (req, res, next) => {
  const { gsec, msec1, msec2, hsec } = req.body;
  const hostel = config.HOSTEL;
  
  const isThereMSec2 = hostel === 'BHR' || hostel === 'MHR';

  // const checkIfAllEntries = 
  
  const email = req.user.emails[0].value;
  if (!gsec || !msec1 || !hsec || (isThereMSec2 && !msec2))
    return next(
      new AppError("Bad Request, Votes for all posts not present", 400)
    );

  const eligible = await authCheck(hostel, email);

  const currHostel = await Hostel.findOne({ hostel: hostel });

  currHostel.voted.push(email);
  const candidates = currHostel.contestants;

  upVoteACandidate(candidates, gsec, "gsec");
  upVoteACandidate(candidates, msec1, "msec");
  upVoteACandidate(candidates, hsec, "hsec");

  await currHostel.save();

  res.status(200).json({
    status: "success",
    message: "Vote has been successfully registered",
  });
});

const createHostel = catchAsync(async (req, res, next) => {
  const { hostel, voted, contestants } = req.body;

  const newHostel = await Hostel.create({ hostel, voted, contestants });

  if (!newHostel)
    return next(new AppError("Something went wrong creating hostel", 500));

  console.log(newHostel);

  res.status(201).json({
    status: "status",
    message: `Hostel ${newHostel.hostel} created successfully`,
  });
});

const getWinner = (contestants) => {
  const winner = contestants.reduce((prev, current) => {
    return current.votes > prev.votes ? current : prev;
  });
  return winner;
};

const getResults = catchAsync(async (req, res, next) => {
  const email = req.user?.emails[0].value;

  if (!email || email !== WARDEN_EMAIL) {
    return next(new AppError("You are not allowed to access the results", 401));
  }

  const { hostel } = req.body;

  if (!hostel || !["BHR", "SHR", "RHR", "MHR", "GHR"].includes(hostel)) {
    throw new AppError("No hostel present", 400);
  }

  const currHostel = await Hostel.findOne({ hostel: hostel });

  const contestants = currHostel.contestants;

  const gsecCandidates = [],
    msecCandidates = [],
    hsecCandidates = [];

  contestants.forEach((contestant) => {
    // console.log(contestant);
    if (contestant.position === "gsec") gsecCandidates.push(contestant);
    else if (contestant.position === "msec") msecCandidates.push(contestant);
    else hsecCandidates.push(contestant);
  });

  const results = {
    hostel,
    results: {
      gsec: { winner: getWinner(gsecCandidates), contestants: gsecCandidates },
      msec: { winner: getWinner(msecCandidates), contestants: msecCandidates },
      hsec: { winner: getWinner(hsecCandidates), contestants: hsecCandidates },
    },
  };

  res.status(200).json({
    status: "success",
    message: "Results Fetched successfully",
    results,
  });
});

module.exports = {
  googleSuccess,
  checkEligibility,
  vote,
  createHostel,
  getResults,
  hasVoted,
};
