const Timetable = require("../models/timetableSchema");
const { pickAllowedFields } = require("../utils/pickAllowedFields");

// Create Timetable Entry
exports.createTimetable = async (req, res, next) => {
  try {
    const allowedFields = pickAllowedFields(req.body, [
      "department",
      "semester",
      "sclass",
      "course",
      "teacher",
      "day",
      "startTime",
      "endTime",
      "room",
      "school",
    ]);
    const entry = new Timetable(allowedFields);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

// Get Timetable for a Class/Semester/Department
exports.getTimetable = async (req, res, next) => {
  try {
    const { sclass } = req.params;
    const timetable = await Timetable.find({ sclass })
      .populate("course", "subName")
      .populate("teacher", "name email")
      .populate("department", "name")
      .populate("semester", "name");
    res.json(timetable);
  } catch (err) {
    next(err);
  }
};

// Update Timetable Entry
exports.updateTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = pickAllowedFields(req.body, [
      "department",
      "semester",
      "sclass",
      "course",
      "teacher",
      "day",
      "startTime",
      "endTime",
      "room",
      "school",
    ]);
    const entry = await Timetable.findByIdAndUpdate(id, update, { new: true });
    if (!entry)
      return res.status(404).json({ message: "Timetable entry not found" });
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

// Delete Timetable Entry
exports.deleteTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.findByIdAndDelete(id);
    if (!entry)
      return res.status(404).json({ message: "Timetable entry not found" });
    res.json({ message: "Timetable entry deleted" });
  } catch (err) {
    next(err);
  }
};
