const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending",
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
});

module.exports = mongoose.model("complain", complainSchema);
