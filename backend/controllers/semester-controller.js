const Semester = require("../models/semesterSchema");

// Create Semester
exports.createSemester = async (req, res, next) => {
  try {
    const { name, department, school } = req.body;
    const existing = await Semester.findOne({ name, department, school });
    if (existing)
      return res.status(400).json({ message: "Semester already exists" });
    const semester = new Semester({ name, department, school });
    await semester.save();
    res.status(201).json(semester);
  } catch (err) {
    next(err);
  }
};

// Get All Semesters for a Department
exports.getSemesters = async (req, res, next) => {
  try {
    const { department } = req.params;
    const semesters = await Semester.find({ department });
    res.json(semesters);
  } catch (err) {
    next(err);
  }
};

// Update Semester
exports.updateSemester = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const semester = await Semester.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );
    if (!semester)
      return res.status(404).json({ message: "Semester not found" });
    res.json(semester);
  } catch (err) {
    next(err);
  }
};

// Delete Semester
exports.deleteSemester = async (req, res, next) => {
  try {
    const { id } = req.params;
    const semester = await Semester.findByIdAndDelete(id);
    if (!semester)
      return res.status(404).json({ message: "Semester not found" });
    res.json({ message: "Semester deleted" });
  } catch (err) {
    next(err);
  }
};
