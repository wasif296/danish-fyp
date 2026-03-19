const AssignmentSubmission = require("../models/assignmentSubmissionSchema");
const {
  deleteCloudinaryFile,
  getCloudinaryUploadData,
} = require("../utils/cloudinaryFile");

// Submit Assignment
exports.submitAssignment = async (req, res, next) => {
  try {
    const assignment = req.body.assignment || req.body.assignmentId;
    const student = req.body.student || req.user?.id;
    const { fileUrl, filePublicId, fileResourceType } = getCloudinaryUploadData(
      req.file,
    );
    const { comment } = req.body;

    const submission = new AssignmentSubmission({
      assignment,
      student,
      fileUrl: fileUrl || req.body.fileUrl,
      filePublicId,
      fileResourceType,
      comment,
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
};

// Get Submissions for Assignment/Student
exports.getSubmissions = async (req, res, next) => {
  try {
    const assignment = req.query.assignment || req.query.assignmentId;
    const student =
      req.query.student ||
      (req.user?.role === "Student" ? req.user.id : undefined);
    const filter = {};
    if (assignment) filter.assignment = assignment;
    if (student) filter.student = student;
    const submissions = await AssignmentSubmission.find(filter)
      .populate("assignment")
      .populate("student");
    res.json(submissions);
  } catch (err) {
    next(err);
  }
};

// Update Submission
exports.updateSubmission = async (req, res, next) => {
  try {
    const existingSubmission = await AssignmentSubmission.findById(
      req.params.id,
    );

    if (!existingSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const { fileUrl, filePublicId, fileResourceType } = getCloudinaryUploadData(
      req.file,
    );
    const update = {
      assignment: req.body.assignment || req.body.assignmentId,
      student: req.body.student || req.user?.id,
      fileUrl: fileUrl || req.body.fileUrl,
      filePublicId,
      fileResourceType,
      comment: req.body.comment,
    };

    Object.keys(update).forEach((key) => {
      if (update[key] === undefined || update[key] === "") {
        delete update[key];
      }
    });

    const submission = await AssignmentSubmission.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true },
    );

    if (req.file && existingSubmission.filePublicId) {
      await deleteCloudinaryFile(existingSubmission);
    }

    res.json(submission);
  } catch (err) {
    next(err);
  }
};

// Delete Submission
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await AssignmentSubmission.findOneAndDelete({
      _id: req.params.id,
    });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json({ message: "Submission deleted" });
  } catch (err) {
    next(err);
  }
};

// Grade Submission
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { marks, feedback } = req.body;
    const submission = await AssignmentSubmission.findByIdAndUpdate(
      id,
      { marks, feedback },
      { new: true },
    );
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (err) {
    next(err);
  }
};
