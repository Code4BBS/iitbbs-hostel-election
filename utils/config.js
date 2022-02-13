require("dotenv").config();

let PORT = process.env.PORT;
let NODE_ENV = process.env.NODE_ENV;
let MONGODB_URI = process.env.MONGODB_URI;
let CLIENT_ID = process.env.CLIENT_ID;
let SPREADSHEET_ID = process.env.SPREADSHEET_ID;
let SESSION_SECRET = process.env.SESSION_SECRET;
let HOSTEL = process.env.HOSTEL;

module.exports = {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  CLIENT_ID,
  SPREADSHEET_ID,
  SESSION_SECRET,
  HOSTEL,
};
