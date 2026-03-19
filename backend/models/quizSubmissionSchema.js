const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "quiz", required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId },
      answer: { type: String },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
  marks: { type: Number },
  feedback: { type: String },
});

module.exports = mongoose.model("quizsubmission", quizSubmissionSchema);
