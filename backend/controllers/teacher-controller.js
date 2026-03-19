const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const { createAuthResponse } = require("../utils/auth.js");
const {
  buildTeacherAttendanceSummary,
} = require("../utils/attendanceSummary.js");
const { clearCachedAnalytics } = require("../utils/analyticsCache.js");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.max(Number.parseInt(query.limit, 10) || DEFAULT_LIMIT, 1);

  return { page, limit, skip: (page - 1) * limit };
};

const formatTeacherWithAttendanceSummary = (teacher) => {
  const teacherObject =
    typeof teacher.toObject === "function"
      ? teacher.toObject()
      : { ...teacher };

  teacherObject.attendanceSummary = buildTeacherAttendanceSummary(
    teacherObject.attendance || [],
  );

  return teacherObject;
};

const teacherRegister = async (req, res, next) => {
  const { name, email, password, role, teachSubject, teachSclass } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      role,
      school: req.user?._id,
      teachSubject,
      teachSclass,
    });

    const existingTeacherByEmail = await Teacher.findOne({ email });

    if (existingTeacherByEmail) {
      res.send({ message: "Email already exists" });
    } else {
      let result = await teacher.save();
      await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
      clearCachedAnalytics(req.user?._id);
      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    next(err);
  }
};

const teacherLogIn = async (req, res, next) => {
  try {
    let teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) {
      const validated = await bcrypt.compare(
        req.body.password,
        teacher.password,
      );
      if (validated) {
        teacher = await teacher.populate("teachSubject", "subName sessions");
        teacher = await teacher.populate("school", "schoolName");
        teacher = await teacher.populate("teachSclass", "sclassName");
        res.send(
          createAuthResponse(formatTeacherWithAttendanceSummary(teacher)),
        );
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "Teacher not found" });
    }
  } catch (err) {
    next(err);
  }
};

const getTeachers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [teachers, total] = await Promise.all([
      Teacher.find({ school: req.params.id })
        .populate("teachSubject", "subName")
        .populate("teachSclass", "sclassName")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
      Teacher.countDocuments({ school: req.params.id }),
    ]);

    const modifiedTeachers = teachers.map((teacher) => {
      const formattedTeacher = formatTeacherWithAttendanceSummary(teacher);
      return { ...formattedTeacher, password: undefined };
    });

    res.send({
      data: modifiedTeachers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTeacherDetail = async (req, res, next) => {
  try {
    let teacher = await Teacher.findById(req.params.id)
      .populate("teachSubject", "subName sessions")
      .populate("school", "schoolName")
      .populate("teachSclass", "sclassName");
    if (teacher) {
      const formattedTeacher = formatTeacherWithAttendanceSummary(teacher);
      formattedTeacher.password = undefined;
      res.send(formattedTeacher);
    } else {
      res.send({ message: "No teacher found" });
    }
  } catch (err) {
    next(err);
  }
};

const updateTeacherSubject = async (req, res, next) => {
  const { teacherId, teachSubject } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teachSubject },
      { new: true },
    );

    await Subject.findByIdAndUpdate(teachSubject, {
      teacher: updatedTeacher._id,
    });

    res.send(updatedTeacher);
  } catch (error) {
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    await Subject.updateOne(
      { teacher: deletedTeacher._id, teacher: { $exists: true } },
      { $unset: { teacher: 1 } },
    );

    res.send(deletedTeacher);
  } catch (error) {
    next(error);
  }
};

const deleteTeachers = async (req, res, next) => {
  try {
    const deletionResult = await Teacher.deleteMany({ school: req.params.id });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No teachers found to delete" });
      return;
    }

    const deletedTeachers = await Teacher.find({ school: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" }, $unset: { teacher: null } },
    );

    res.send(deletionResult);
  } catch (error) {
    next(error);
  }
};

const deleteTeachersByClass = async (req, res, next) => {
  try {
    const deletionResult = await Teacher.deleteMany({
      sclassName: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: "No teachers found to delete" });
      return;
    }

    const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

    await Subject.updateMany(
      {
        teacher: { $in: deletedTeachers.map((teacher) => teacher._id) },
        teacher: { $exists: true },
      },
      { $unset: { teacher: "" }, $unset: { teacher: null } },
    );

    res.send(deletionResult);
  } catch (error) {
    next(error);
  }
};

const teacherAttendance = async (req, res, next) => {
  const { status, date } = req.body;

  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.send({ message: "Teacher not found" });
    }

    const attendanceDate = new Date(date);

    if (!status || Number.isNaN(attendanceDate.getTime())) {
      return res
        .status(400)
        .send({ message: "Valid status and date are required" });
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === attendanceDate.toDateString(),
    );

    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.presentCount = status === "Present" ? "1" : "0";
      existingAttendance.absentCount = status === "Absent" ? "1" : "0";
    } else {
      teacher.attendance.push({
        date: attendanceDate,
        status,
        presentCount: status === "Present" ? "1" : "0",
        absentCount: status === "Absent" ? "1" : "0",
      });
    }

    const result = await teacher.save();
    return res.send(formatTeacherWithAttendanceSummary(result));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  updateTeacherSubject,
  deleteTeacher,
  deleteTeachers,
  deleteTeachersByClass,
  teacherAttendance,
};
