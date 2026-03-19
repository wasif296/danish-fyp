const mongoose = require("mongoose");
const { deleteCloudinaryFile } = require("../utils/cloudinaryFile");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  filePublicId: { type: String },
  fileResourceType: { type: String },
  dueDate: { type: Date, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  sclass: {
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
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

assignmentSchema.pre("findOneAndDelete", async function cleanup(next) {
  try {
    const assignment = await this.model
      .findOne(this.getFilter())
      .select("_id fileUrl filePublicId fileResourceType");

    if (!assignment) {
      return next();
    }

    const AssignmentSubmission = mongoose.model("assignmentsubmission");
    const submissions = await AssignmentSubmission.find({
      assignment: assignment._id,
    }).select("_id");

    await Promise.all(
      submissions.map((submission) =>
        AssignmentSubmission.findOneAndDelete({ _id: submission._id }),
      ),
    );

    if (assignment.fileUrl || assignment.filePublicId) {
      await deleteCloudinaryFile(assignment);
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("assignment", assignmentSchema);
