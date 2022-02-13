const mongoose = require("mongoose");
const validator = require("validator");

const hostelSchema = new mongoose.Schema({
  hostel: {
    type: String,
    enum: ["BHR", "SHR", "GHR", "MHR", "RHR"],
  },
  voted: [
    {
      type: String,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
  ],
  contestants: [
    {
      name: { type: String },
      email: { type: String },
      position: { type: String },
      image: { type: String },
      votes: { type: Number, default: 0 },
    },
  ],
});

const Hostel = mongoose.model("Hostel", hostelSchema);

module.exports = Hostel;
