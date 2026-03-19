const CourseContent = require("../models/courseContentSchema");
const Subject = require("../models/subjectSchema");
const Teacher = require("../models/teacherSchema");
const {
  deleteCloudinaryFile,
  getCloudinaryUploadData,
} = require("../utils/cloudinaryFile");

const inferContentType = (file, fallbackType) => {
  if (fallbackType) return fallbackType;
  if (!file?.mimetype) return "other";

  const subtype = file.mimetype.split("/")[1];
  if (["pdf", "slide", "note", "video", "other"].includes(subtype)) {
    return subtype;
  }

  return "other";
};

const inferContentFields = async (req) => {
  const course = req.body.course || req.body.subjectId;
  const sclass = req.body.sclass || req.body.classId;
  const { fileUrl, filePublicId, fileResourceType } = getCloudinaryUploadData(
    req.file,
  );
  const subject = course ? await Subject.findById(course) : null;

  let teacher = req.body.teacher;
  if (!teacher && req.user?.role === "Teacher") {
    teacher = req.user.id;
  }

  if (!teacher && subject?.teacher) {
    teacher = subject.teacher;
  }

  if (!teacher && req.user?.role === "Admin" && req.body.teacherEmail) {
    const teacherRecord = await Teacher.findOne({
      email: req.body.teacherEmail,
    });
    teacher = teacherRecord?._id;
  }

  return {
    title: req.body.title,
    description: req.body.description,
    fileUrl: fileUrl || req.body.fileUrl,
    filePublicId,
    fileResourceType,
    type: inferContentType(req.file, req.body.type),
    course,
    sclass: sclass || subject?.sclassName,
    department: req.body.department || subject?.department,
    semester: req.body.semester || subject?.semester,
    teacher,
    school: req.body.school || subject?.school,
  };
};

// Create Course Content
exports.createContent = async (req, res, next) => {
  try {
    const payload = await inferContentFields(req);
    const content = new CourseContent(payload);
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    next(err);
  }
};

// Get Course Contents for a Course/Class
exports.getContents = async (req, res, next) => {
  try {
    const course = req.query.course || req.query.subjectId;
    const sclass = req.query.sclass || req.query.classId;
    const filter = {};
    if (course) filter.course = course;
    if (sclass) filter.sclass = sclass;
    const contents = await CourseContent.find(filter)
      .populate("course", "subName")
      .populate("teacher", "name email");
    res.json(contents);
  } catch (err) {
    next(err);
  }
};

// Update Course Content
exports.updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingContent = await CourseContent.findById(id);

    if (!existingContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    if (
      req.user?.role === "Teacher" &&
      String(existingContent.teacher) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "You can only edit your own content" });
    }

    const update = await inferContentFields(req);
    const previousFile = {
      fileUrl: existingContent.fileUrl,
      filePublicId: existingContent.filePublicId,
      fileResourceType: existingContent.fileResourceType,
    };
    Object.keys(update).forEach((key) => {
      if (update[key] === undefined || update[key] === "") {
        delete update[key];
      }
    });
    const content = await CourseContent.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (req.file && previousFile.filePublicId) {
      await deleteCloudinaryFile(previousFile);
    }

    res.json(content);
  } catch (err) {
    next(err);
  }
};

// Delete Course Content
exports.deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const content = await CourseContent.findById(id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    if (
      req.user?.role === "Teacher" &&
      String(content.teacher) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own content" });
    }

    await CourseContent.findOneAndDelete({ _id: id });
    res.json({ message: "Content deleted" });
  } catch (err) {
    next(err);
  }
};
