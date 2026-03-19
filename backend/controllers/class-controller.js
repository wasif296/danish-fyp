const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");

const sclassCreate = async (req, res, next) => {
  try {
    const { sclassName, department, semester, adminID } = req.body;
    if (!department || !semester) {
      return res
        .status(400)
        .json({ message: "Department and Semester are required" });
    }
    const existingSclassByName = await Sclass.findOne({
      sclassName,
      department,
      semester,
      school: adminID,
    });
    if (existingSclassByName) {
      return res.send({
        message:
          "Sorry this class name already exists in this department and semester",
      });
    }
    const sclass = new Sclass({
      sclassName,
      department,
      semester,
      school: adminID,
    });
    const result = await sclass.save();
    res.send(result);
  } catch (err) {
    next(err);
  }
};

const sclassList = async (req, res, next) => {
  try {
    let sclasses = await Sclass.find({ school: req.params.id });
    if (sclasses.length > 0) {
      res.send(sclasses);
    } else {
      res.send({ message: "No sclasses found" });
    }
  } catch (err) {
    next(err);
  }
};

const getSclassDetail = async (req, res, next) => {
  try {
    let sclass = await Sclass.findById(req.params.id);
    if (sclass) {
      sclass = await sclass.populate("school", "schoolName");
      res.send(sclass);
    } else {
      res.send({ message: "No class found" });
    }
  } catch (err) {
    next(err);
  }
};

const getSclassStudents = async (req, res, next) => {
  try {
    let students = await Student.find({ sclassName: req.params.id });
    if (students.length > 0) {
      let modifiedStudents = students.map((student) => {
        return { ...student._doc, password: undefined };
      });
      res.send(modifiedStudents);
    } else {
      res.send({ message: "No students found" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteSclass = async (req, res, next) => {
  try {
    const deletedClass = await Sclass.findOneAndDelete({ _id: req.params.id });
    if (!deletedClass) {
      return res.send({ message: "Class not found" });
    }
    await Teacher.deleteMany({
      teachSclass: req.params.id,
    });
    res.send(deletedClass);
  } catch (error) {
    next(error);
  }
};

const deleteSclasses = async (req, res, next) => {
  try {
    const classesToDelete = await Sclass.find({ school: req.params.id }).select(
      "_id",
    );

    if (classesToDelete.length === 0) {
      return res.send({ message: "No classes found to delete" });
    }

    await Promise.all(
      classesToDelete.map((sclass) =>
        Sclass.findOneAndDelete({ _id: sclass._id }),
      ),
    );

    await Teacher.deleteMany({
      teachSclass: { $in: classesToDelete.map((sclass) => sclass._id) },
    });

    res.send({
      acknowledged: true,
      deletedCount: classesToDelete.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
};
