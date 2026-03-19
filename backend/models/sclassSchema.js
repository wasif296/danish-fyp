const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema(
  {
    sclassName: {
      type: String,
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
  },
  { timestamps: true },
);

sclassSchema.pre("findOneAndDelete", async function cascadeDelete(next) {
  try {
    const classToDelete = await this.model
      .findOne(this.getFilter())
      .select("_id");

    if (!classToDelete) {
      return next();
    }

    const Subject = mongoose.model("subject");
    const Student = mongoose.model("student");
    const relatedSubjects = await Subject.find({
      sclassName: classToDelete._id,
    }).select("_id");

    await Promise.all(
      relatedSubjects.map((subject) =>
        Subject.findOneAndDelete({ _id: subject._id }),
      ),
    );

    await Student.updateMany(
      { sclassName: classToDelete._id },
      { $set: { sclassName: null } },
    );

    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("sclass", sclassSchema);
