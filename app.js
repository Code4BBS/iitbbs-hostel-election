const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const path = require("path");
// const session = require("cookie-session");

const middleware = require("./utils/middleware");
const config = require("./utils/config");
const AppError = require("./utils/appError");

const authRouter = require("./routes/authRoute");
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

app.use(mongoSanitize());

app.use(middleware.requestLogger);

app.use(express.static(path.join(__dirname, "client/build")));

app.use("/auth", authRouter);
app.use("/hostel", hostelRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(middleware.errorHandler);

module.exports = app;
