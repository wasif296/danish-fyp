const bcrypt = require("bcrypt");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");
const { createAuthResponse } = require("../utils/auth.js");
const {
  buildStudentAttendanceSummary,
} = require("../utils/attendanceSummary.js");
const { pickAllowedFields } = require("../utils/pickAllowedFields.js");
const { clearCachedAnalytics } = require("../utils/analyticsCache.js");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.max(Number.parseInt(query.limit, 10) || DEFAULT_LIMIT, 1);

  return { page, limit, skip: (page - 1) * limit };
};

const formatStudentWithAttendanceSummary = (student) => {
  const studentObject =
    typeof student.toObject === "function"
      ? student.toObject()
      : { ...student };

  studentObject.attendanceSummary = buildStudentAttendanceSummary(
    studentObject.attendance || [],
  );

  return studentObject;
};

const studentRegister = async (req, res, next) => {
  try {
    const allowedFields = pickAllowedFields(req.body, [
      "name",
      "rollNum",
      "password",
      "sclassName",
      "adminID",
    ]);
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(allowedFields.password, salt);
    const schoolId = req.user?._id;

    const existingStudent = await Student.findOne({
      rollNum: allowedFields.rollNum,
      school: schoolId,
      sclassName: allowedFields.sclassName,
    });

    if (existingStudent) {
      res.send({ message: "Roll Number already exists" });
    } else {
      const student = new Student({
        name: allowedFields.name,
        rollNum: allowedFields.rollNum,
        sclassName: allowedFields.sclassName,
        school: schoolId,
        password: hashedPass,
      });

      let result = await student.save();
      clearCachedAnalytics(schoolId);

      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    next(err);
  }
};

const studentLogIn = async (req, res, next) => {
  try {
    let student = await Student.findOne({
      rollNum: req.body.rollNum,
      name: req.body.studentName,
    }).select("+password");
    if (student) {
      const validated = await bcrypt.compare(
        req.body.password,
        student.password,
      );
      if (validated) {
        student = await student.populate("school", "schoolName");
        student = await student.populate("sclassName", "sclassName");
        student.examResult = undefined;
        student.attendance = undefined;
        res.send(createAuthResponse(student));
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "Student not found" });
    }
  } catch (err) {
    next(err);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = req.query.search?.trim();
    const filter = { school: req.params.id };

    if (search) {
      const regex = escapeRegex(search);
      filter.$or = [
        { name: { $regex: regex, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$rollNum" },
              regex,
              options: "i",
            },
          },
        },
      ];
    }

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("sclassName", "sclassName")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
      Student.countDocuments(filter),
    ]);

    const modifiedStudents = students.map((student) => ({
      ...student._doc,
      password: undefined,
    }));

    res.send({
      data: modifiedStudents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      filters: {
        search: search || "",
      },
    });
  } catch (err) {
    next(err);
  }
};

const getStudentDetail = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id)
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .populate("examResult.subName", "subName")
      .populate("attendance.subName", "subName sessions");
    if (student) {
      const formattedStudent = formatStudentWithAttendanceSummary(student);
      formattedStudent.password = undefined;
      res.send(formattedStudent);
    } else {
      res.send({ message: "No student found" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

const deleteStudents = async (req, res, next) => {
  try {
    const result = await Student.deleteMany({ school: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No students found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    next(error);
  }
};

const deleteStudentsByClass = async (req, res, next) => {
  try {
    const result = await Student.deleteMany({ sclassName: req.params.id });
    if (result.deletedCount === 0) {
      res.send({ message: "No students found to delete" });
    } else {
      res.send(result);
    }
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const updates = pickAllowedFields(req.body, [
      "name",
      "rollNum",
      "password",
      "sclassName",
    ]);

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }
    let result = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true },
    );

    res.send(result);
  } catch (error) {
    next(error);
  }
};

const updateExamResult = async (req, res, next) => {
  const { subName, marksObtained } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.send({ message: "Student not found" });
    }

    if (!Array.isArray(student.examResult)) {
      student.examResult = [];
    }

    const normalizedSubName = String(subName);
    const existingResult = student.examResult.find((result) => {
      const resultSubName = result?.subName?._id || result?.subName;
      return String(resultSubName) === normalizedSubName;
    });

    const normalizedMarks = Number(marksObtained);

    if (Number.isNaN(normalizedMarks)) {
      return res.status(400).send({ message: "Marks must be a valid number" });
    }

    if (existingResult) {
      existingResult.marksObtained = normalizedMarks;
    } else {
      student.examResult.push({ subName, marksObtained: normalizedMarks });
    }

    let result = await student.save();
    result = await result.populate("examResult.subName", "subName");
    return res.send(result);
  } catch (error) {
    next(error);
  }
};

const studentAttendance = async (req, res, next) => {
  const { subName, status, date } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.send({ message: "Student not found" });
    }

    const subject = await Subject.findById(subName);

    if (!subject) {
      return res.status(404).send({ message: "Subject not found" });
    }

    const attendanceDate = new Date(date);

    if (Number.isNaN(attendanceDate.getTime())) {
      return res.status(400).send({ message: "Invalid attendance date" });
    }

    const existingAttendance = student.attendance.find(
      (a) =>
        a.date.toDateString() === attendanceDate.toDateString() &&
        a.subName.toString() === String(subName),
    );

    if (!["Present", "Absent"].includes(status)) {
      return res
        .status(400)
        .send({ message: "Attendance status must be Present or Absent" });
    }

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      // Check if the student has already attended the maximum number of sessions
      const attendedSessions = student.attendance.filter(
        (a) => a.subName.toString() === String(subName),
      ).length;

      const maxSessions = Number(subject.sessions || 0);

      if (maxSessions && attendedSessions >= maxSessions) {
        return res.send({ message: "Maximum attendance limit reached" });
      }

      student.attendance.push({ date: attendanceDate, status, subName });
    }

    let result = await student.save();
    result = await result.populate("attendance.subName", "subName sessions");

    const formattedStudent = formatStudentWithAttendanceSummary(result);
    return res.send(formattedStudent);
  } catch (error) {
    next(error);
  }
};

const clearAllStudentsAttendanceBySubject = async (req, res, next) => {
  const subName = req.params.id;

  try {
    const result = await Student.updateMany(
      { "attendance.subName": subName },
      { $pull: { attendance: { subName } } },
    );
    return res.send(result);
  } catch (error) {
    next(error);
  }
};

const clearAllStudentsAttendance = async (req, res, next) => {
  const schoolId = req.params.id;

  try {
    const result = await Student.updateMany(
      { school: schoolId },
      { $set: { attendance: [] } },
    );

    return res.send(result);
  } catch (error) {
    next(error);
  }
};

const removeStudentAttendanceBySubject = async (req, res, next) => {
  const studentId = req.params.id;
  const subName = req.body.subId;

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $pull: { attendance: { subName: subName } } },
    );

    return res.send(result);
  } catch (error) {
    next(error);
  }
};

const removeStudentAttendance = async (req, res, next) => {
  const studentId = req.params.id;

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $set: { attendance: [] } },
    );

    return res.send(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,

  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
};
