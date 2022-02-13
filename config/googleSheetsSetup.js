const { google, Auth } = require("googleapis");
const config = require("../utils/config");

const auth = new Auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const spreadsheetId = config.SPREADSHEET_ID;

let googleSheets = null;

const initializeGoogleSheetsClient = async () => {
  console.log("initializeGoogleSheetsClient");

  const client = await auth.getClient();

  googleSheets = google.sheets({ version: "v4", auth: client });
};

const getEmailsOfAHostel = async (hostel) => {
  // const client = await auth.getClient();

  // const googleSheets = google.sheets({ version: "v4", auth: client });

  if (!googleSheets) {
    console.log("This is not there initializing again");
    await initializeGoogleSheetsClient();
  }

  const response = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: `${hostel}!A:A`,
  });

  const emails = [];

  for (let i = 1; i < response.data.values.length; ++i) {
    emails.push(response.data.values[i][0]);
  }

  return emails;
};

const checkEmailInHostel = async (email) => {
  try {
    const hostel = config.HOSTEL;
    const emails = await getEmailsOfAHostel(hostel);
    return emails.includes(email);
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  getEmailsOfAHostel,
  checkEmailInHostel,
  initializeGoogleSheetsClient,
};
