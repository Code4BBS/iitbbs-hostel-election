const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const path = require("path");
const passport = require("passport");
// const session = require("cookie-session");

const middleware = require("./utils/middleware");
const clientEndpoints = ["login", "election", "403", "404"];
const config = require("./utils/config");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const passportSetup = require("./config/passportSetup");

const authRouter = require("./routes/authRoute");

const { checkEmailInHostel } = require("./config/googleSheetsSetup");
const { hasVoted } = require("./controller/controller");
const hostelRouter = require("./routes/hostelRoute");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(xss());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

//oAuth session
// app.use(
//   session({
//     secret: config.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.use(mongoSanitize());

app.use(middleware.requestLogger);

app.get("/", (req, res, next) => {
  res.redirect("/login");
});
app.get("//*", (req, res, next) => {
  res.redirect("/login");
});

app.use(express.static(path.join(__dirname, "client/build")));

app.use(async (req, res, next) => {
  const email = req.user?.emails[0].value;
  const hostelUser = email ? await checkEmailInHostel(email) : false;
  const voted = hostelUser ? await hasVoted("BHR", email) : true;

  console.log({ email, hostelUser, voted });

  if (!email) {
    if (
      req.originalUrl !== "/auth/google" &&
      req.originalUrl !== "/login" &&
      !req.originalUrl.startsWith("/auth/")
    )
      res.redirect("/login");
    else next();
  } else {
    if (req.originalUrl === "/auth/logout") next();
    else if (!hostelUser && req.originalUrl !== "/404") res.redirect("/404");
    else if (hostelUser && voted) {
      if (req.originalUrl !== "/403") res.redirect("/403");
      else next();
    } else if (hostelUser && req.originalUrl !== "/election")
      res.redirect("/election");
    else next();
  }
});

app.use("/auth", authRouter);
app.use("/hostel", hostelRouter);

app.get("/:clientEndpoint", (req, res, next) => {
  console.log(req.params.clientEndpoint);
  if (clientEndpoints.includes(req.params.clientEndpoint)) {
    console.log("yeah");
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
  } else {
    next();
  }
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(middleware.errorHandler);

module.exports = app;
