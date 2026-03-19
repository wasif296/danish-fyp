const Quiz = require("../models/quizSchema");
const { pickAllowedFields } = require("../utils/pickAllowedFields");

// Create Quiz
exports.createQuiz = async (req, res, next) => {
  try {
    const allowedFields = pickAllowedFields(req.body, [
      "title",
      "description",
      "questions",
      "dueDate",
      "course",
      "sclass",
      "department",
      "semester",
      "teacher",
      "school",
    ]);
    const quiz = new Quiz(allowedFields);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
};

// Get Quizzes for a Course/Class
exports.getQuizzes = async (req, res, next) => {
  try {
    const { course, sclass } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (sclass) filter.sclass = sclass;
    const quizzes = await Quiz.find(filter)
      .populate("course", "subName")
      .populate("teacher", "name email");
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
};

// Update Quiz
exports.updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = pickAllowedFields(req.body, [
      "title",
      "description",
      "questions",
      "dueDate",
      "course",
      "sclass",
      "department",
      "semester",
      "teacher",
      "school",
    ]);
    const quiz = await Quiz.findByIdAndUpdate(id, update, { new: true });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    next(err);
  }
};

// Delete Quiz
exports.deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    next(err);
  }
};
