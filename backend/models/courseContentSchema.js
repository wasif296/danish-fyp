const mongoose = require("mongoose");
const { deleteCloudinaryFile } = require("../utils/cloudinaryFile");

const courseContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  filePublicId: { type: String },
  fileResourceType: { type: String },
  type: {
    type: String,
    enum: ["pdf", "slide", "note", "video", "other"],
    required: true,
  },
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

courseContentSchema.pre(
  "findOneAndDelete",
  async function removeRemoteFile(next) {
    try {
      const content = await this.model
        .findOne(this.getFilter())
        .select("fileUrl filePublicId fileResourceType");

      if (content?.fileUrl || content?.filePublicId) {
        await deleteCloudinaryFile(content);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = mongoose.model("coursecontent", courseContentSchema);
