const QuizSubmission = require("../models/quizSubmissionSchema");

// Submit Quiz
exports.submitQuiz = async (req, res, next) => {
  try {
    const { quiz, student, answers } = req.body;
    const submission = new QuizSubmission({ quiz, student, answers });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
};

// Get Submissions for Quiz/Student
exports.getSubmissions = async (req, res, next) => {
  try {
    const { quiz, student } = req.query;
    const filter = {};
    if (quiz) filter.quiz = quiz;
    if (student) filter.student = student;
    const submissions = await QuizSubmission.find(filter)
      .populate("quiz")
      .populate("student");
    res.json(submissions);
  } catch (err) {
    next(err);
  }
};

// Grade Submission
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { marks, feedback } = req.body;
    const submission = await QuizSubmission.findByIdAndUpdate(
      id,
      { marks, feedback },
      { new: true },
    );
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (err) {
    next(err);
  }
};
