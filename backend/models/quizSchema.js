const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [String],
      correctAnswer: { type: String },
    },
  ],
  dueDate: { type: Date, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  sclass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sclass",
    required: true,
  },
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("quiz", quizSchema);
