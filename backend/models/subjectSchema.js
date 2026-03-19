const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subName: {
      type: String,
      required: true,
    },
    subCode: {
      type: String,
      required: true,
    },
    sessions: {
      type: String,
      required: true,
    },
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "semester",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
  },
  { timestamps: true },
);

subjectSchema.pre("findOneAndDelete", async function cascadeDelete(next) {
  try {
    const subjectToDelete = await this.model
      .findOne(this.getFilter())
      .select("_id");

    if (!subjectToDelete) {
      return next();
    }

    const Assignment = mongoose.model("assignment");
    const CourseContent = mongoose.model("coursecontent");
    const Teacher = mongoose.model("teacher");
    const Student = mongoose.model("student");
    const assignments = await Assignment.find({
      course: subjectToDelete._id,
    }).select("_id");
    const contents = await CourseContent.find({
      course: subjectToDelete._id,
    }).select("_id");

    await Promise.all([
      ...assignments.map((assignment) =>
        Assignment.findOneAndDelete({ _id: assignment._id }),
      ),
      ...contents.map((content) =>
        CourseContent.findOneAndDelete({ _id: content._id }),
      ),
      Teacher.updateMany(
        { teachSubject: subjectToDelete._id },
        { $unset: { teachSubject: 1 } },
      ),
      Student.updateMany(
        {},
        { $pull: { examResult: { subName: subjectToDelete._id } } },
      ),
      Student.updateMany(
        {},
        { $pull: { attendance: { subName: subjectToDelete._id } } },
      ),
    ]);

    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("subject", subjectSchema);
