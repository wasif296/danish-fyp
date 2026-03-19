const Assignment = require("../models/assignmentSchema");
const { pickAllowedFields } = require("../utils/pickAllowedFields");

// Create Assignment
exports.createAssignment = async (req, res, next) => {
  try {
    const allowedFields = pickAllowedFields(req.body, [
      "title",
      "description",
      "fileUrl",
      "dueDate",
      "course",
      "sclass",
      "department",
      "semester",
      "teacher",
      "school",
    ]);
    if (req.user?.role === "Teacher") {
      allowedFields.teacher = req.user._id;
    }
    const assignment = new Assignment(allowedFields);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

// Get Assignments for a Course/Class
exports.getAssignments = async (req, res, next) => {
  try {
    const { course, sclass } = req.query;
    const filter = {};
    if (course) filter.course = course;
    if (sclass) filter.sclass = sclass;
    const assignments = await Assignment.find(filter)
      .populate("course", "subName")
      .populate("teacher", "name email");
    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

// Update Assignment
exports.updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingAssignment = await Assignment.findById(id);

    if (!existingAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (
      req.user?.role === "Teacher" &&
      String(existingAssignment.teacher) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "You can only edit your own assignments" });
    }

    const update = pickAllowedFields(req.body, [
      "title",
      "description",
      "fileUrl",
      "dueDate",
      "course",
      "sclass",
      "department",
      "semester",
      "teacher",
      "school",
    ]);
    if (req.user?.role === "Teacher") {
      update.teacher = req.user._id;
    }
    const assignment = await Assignment.findByIdAndUpdate(id, update, {
      new: true,
    });
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

// Delete Assignment
exports.deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    if (
      req.user?.role === "Teacher" &&
      String(assignment.teacher) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own assignments" });
    }

    await Assignment.findOneAndDelete({ _id: id });
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    next(err);
  }
};
