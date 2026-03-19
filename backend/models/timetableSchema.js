const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "semester",
      required: true,
    },
    sclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("timetable", timetableSchema);
