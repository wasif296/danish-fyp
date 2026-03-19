const mongoose = require("mongoose");
const { deleteCloudinaryFile } = require("../utils/cloudinaryFile");

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "assignment",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  fileUrl: { type: String },
  filePublicId: { type: String },
  fileResourceType: { type: String },
  comment: { type: String },
  submittedAt: { type: Date, default: Date.now },
  marks: { type: Number },
  feedback: { type: String },
});

assignmentSubmissionSchema.pre(
  "findOneAndDelete",
  async function removeRemoteFile(next) {
    try {
      const submission = await this.model
        .findOne(this.getFilter())
        .select("fileUrl filePublicId fileResourceType");

      if (submission?.fileUrl || submission?.filePublicId) {
        await deleteCloudinaryFile(submission);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = mongoose.model(
  "assignmentsubmission",
  assignmentSubmissionSchema,
);
