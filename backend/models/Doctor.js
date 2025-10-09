const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    department: { type: String },
    nic: { type: String },
    gender: { type: String },
    bio: { type: String },
    dateOfBirth: { type: Date },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
