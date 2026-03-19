const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    default: "Admin",
  },
  schoolName: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("admin", adminSchema);
