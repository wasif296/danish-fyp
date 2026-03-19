const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Student = require("../models/studentSchema.js");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.max(Number.parseInt(query.limit, 10) || DEFAULT_LIMIT, 1);

  return { page, limit, skip: (page - 1) * limit };
};

const subjectCreate = async (req, res, next) => {
  try {
    const { subjects, sclassName, department, semester, adminID } = req.body;
    if (!department || !semester) {
      return res
        .status(400)
        .json({ message: "Department and Semester are required" });
    }
    // Check for duplicate subCode in the same department/semester
    for (const subject of subjects) {
      const exists = await Subject.findOne({
        subCode: subject.subCode,
        department,
        semester,
        school: adminID,
      });
      if (exists) {
        return res.send({
          message: `SubCode ${subject.subCode} already exists in this department and semester`,
        });
      }
    }
    const newSubjects = subjects.map((subject) => ({
      ...subject,
      sclassName,
      department,
      semester,
      school: adminID,
    }));
    const result = await Subject.insertMany(newSubjects);
    res.send(result);
  } catch (err) {
    next(err);
  }
};

const allSubjects = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [subjects, total] = await Promise.all([
      Subject.find({ school: req.params.id })
        .populate("sclassName", "sclassName")
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit),
      Subject.countDocuments({ school: req.params.id }),
    ]);

    res.send({
      data: subjects,
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

const classSubjects = async (req, res, next) => {
  try {
    let subjects = await Subject.find({ sclassName: req.params.id });
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: "No subjects found" });
    }
  } catch (err) {
    next(err);
  }
};

const freeSubjectList = async (req, res, next) => {
  try {
    let subjects = await Subject.find({
      sclassName: req.params.id,
      teacher: { $exists: false },
    });
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: "No subjects found" });
    }
  } catch (err) {
    next(err);
  }
};

const getSubjectDetail = async (req, res, next) => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (subject) {
      subject = await subject.populate("sclassName", "sclassName");
      subject = await subject.populate("teacher", "name");
      res.send(subject);
    } else {
      res.send({ message: "No subject found" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const deletedSubject = await Subject.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedSubject) {
      return res.send({ message: "No subject found" });
    }

    res.send(deletedSubject);
  } catch (error) {
    next(error);
  }
};

const deleteSubjects = async (req, res, next) => {
  try {
    const subjectsToDelete = await Subject.find({
      school: req.params.id,
    }).select("_id");

    if (subjectsToDelete.length === 0) {
      return res.send({ message: "No subjects found to delete" });
    }

    await Promise.all(
      subjectsToDelete.map((subject) =>
        Subject.findOneAndDelete({ _id: subject._id }),
      ),
    );

    res.send({
      acknowledged: true,
      deletedCount: subjectsToDelete.length,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubjectsByClass = async (req, res, next) => {
  try {
    const subjectsToDelete = await Subject.find({
      sclassName: req.params.id,
    }).select("_id");

    if (subjectsToDelete.length === 0) {
      return res.send({ message: "No subjects found to delete" });
    }

    await Promise.all(
      subjectsToDelete.map((subject) =>
        Subject.findOneAndDelete({ _id: subject._id }),
      ),
    );

    res.send({
      acknowledged: true,
      deletedCount: subjectsToDelete.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subjectCreate,
  freeSubjectList,
  classSubjects,
  getSubjectDetail,
  deleteSubjectsByClass,
  deleteSubjects,
  deleteSubject,
  allSubjects,
};
