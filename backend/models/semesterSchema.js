const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("semester", semesterSchema);
