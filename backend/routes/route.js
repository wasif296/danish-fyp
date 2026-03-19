const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {
  authMiddleware,
  checkRole,
  isOwnerOrAdmin,
} = require("../middleware/authMiddleware.js");
const { uploadSingleFile } = require("../middleware/uploadMiddleware.js");
const { validateRequest } = require("../middleware/validateRequest.js");
const {
  adminLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  studentRegisterSchema,
  createSubjectSchema,
  submitAssignmentSchema,
} = require("../validation/schemas.js");
const assignmentSubmissionController = require("../controllers/assignmentSubmission-controller.js");
const quizSubmissionController = require("../controllers/quizSubmission-controller.js");

const authRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

// Assignment Submission
router.post(
  "/AssignmentSubmission",
  authMiddleware,
  checkRole("Student"),
  uploadSingleFile,
  validateRequest(submitAssignmentSchema),
  assignmentSubmissionController.submitAssignment,
);
router.get(
  "/AssignmentSubmissions",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  assignmentSubmissionController.getSubmissions,
);
router.put(
  "/AssignmentSubmission/:id",
  authMiddleware,
  checkRole("Student", "Admin"),
  uploadSingleFile,
  assignmentSubmissionController.updateSubmission,
);
router.delete(
  "/AssignmentSubmission/:id",
  authMiddleware,
  checkRole("Student", "Admin"),
  assignmentSubmissionController.deleteSubmission,
);
router.put(
  "/AssignmentSubmission/:id/grade",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  assignmentSubmissionController.gradeSubmission,
);

// Quiz Submission
router.post(
  "/QuizSubmission",
  authMiddleware,
  checkRole("Student"),
  quizSubmissionController.submitQuiz,
);
router.get(
  "/QuizSubmissions",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  quizSubmissionController.getSubmissions,
);
router.put(
  "/QuizSubmission/:id/grade",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  quizSubmissionController.gradeSubmission,
);
const courseContentController = require("../controllers/courseContent-controller.js");

// Course Content
router.post(
  "/CourseContent",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  uploadSingleFile,
  courseContentController.createContent,
);
router.get(
  "/CourseContents",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  courseContentController.getContents,
);
router.put(
  "/CourseContent/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  uploadSingleFile,
  courseContentController.updateContent,
);
router.delete(
  "/CourseContent/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  courseContentController.deleteContent,
);
const feeVoucherController = require("../controllers/feeVoucher-controller.js");

// Fee Voucher
router.post(
  "/FeeVoucher",
  authMiddleware,
  checkRole("Admin"),
  feeVoucherController.createFeeVoucher,
);
router.get(
  "/FeeVouchers/student/:student",
  authMiddleware,
  checkRole("Admin", "Student"),
  feeVoucherController.getStudentVouchers,
);
router.get(
  "/FeeVouchers",
  authMiddleware,
  checkRole("Admin"),
  feeVoucherController.getVouchersByDeptSem,
);
router.put(
  "/FeeVoucher/:id",
  authMiddleware,
  checkRole("Admin"),
  feeVoucherController.updateVoucherStatus,
);
router.delete(
  "/FeeVoucher/:id",
  authMiddleware,
  checkRole("Admin"),
  feeVoucherController.deleteFeeVoucher,
);
const quizController = require("../controllers/quiz-controller.js");

// Quiz
router.post(
  "/Quiz",
  authMiddleware,
  checkRole("Admin"),
  quizController.createQuiz,
);
router.get(
  "/Quizzes",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  quizController.getQuizzes,
);
router.put(
  "/Quiz/:id",
  authMiddleware,
  checkRole("Admin"),
  quizController.updateQuiz,
);
router.delete(
  "/Quiz/:id",
  authMiddleware,
  checkRole("Admin"),
  quizController.deleteQuiz,
);
const assignmentController = require("../controllers/assignment-controller.js");

// Assignment
router.post(
  "/Assignment",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  assignmentController.createAssignment,
);
router.get(
  "/Assignments",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  assignmentController.getAssignments,
);
router.put(
  "/Assignment/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  assignmentController.updateAssignment,
);
router.delete(
  "/Assignment/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  assignmentController.deleteAssignment,
);
const timetableController = require("../controllers/timetable-controller.js");

// Timetable
router.post(
  "/Timetable",
  authMiddleware,
  checkRole("Admin"),
  timetableController.createTimetable,
);
router.get(
  "/Timetable/:sclass",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  timetableController.getTimetable,
);
router.put(
  "/Timetable/:id",
  authMiddleware,
  checkRole("Admin"),
  timetableController.updateTimetable,
);
router.delete(
  "/Timetable/:id",
  authMiddleware,
  checkRole("Admin"),
  timetableController.deleteTimetable,
);
// router.use(express.json());
// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

const {
  adminRegister,
  adminLogIn,
  getAdminDetail,
  forgotPassword,
  resetPassword,
} = require("../controllers/admin-controller.js");

const {
  sclassCreate,
  sclassList,
  deleteSclass,
  deleteSclasses,
  getSclassDetail,
  getSclassStudents,
} = require("../controllers/class-controller.js");
const {
  complainCreate,
  complainList,
} = require("../controllers/complain-controller.js");
const {
  noticeCreate,
  noticeList,
  deleteNotices,
  deleteNotice,
  updateNotice,
} = require("../controllers/notice-controller.js");
const {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,
  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
} = require("../controllers/student_controller.js");
const {
  subjectCreate,
  classSubjects,
  deleteSubjectsByClass,
  getSubjectDetail,
  deleteSubject,
  freeSubjectList,
  allSubjects,
  deleteSubjects,
} = require("../controllers/subject-controller.js");

const {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  deleteTeachers,
  deleteTeachersByClass,
  deleteTeacher,
  updateTeacherSubject,
  teacherAttendance,
} = require("../controllers/teacher-controller.js");

const departmentController = require("../controllers/department-controller.js");
const semesterController = require("../controllers/semester-controller.js");
const analyticsController = require("../controllers/analytics-controller.js");
// Department
router.post(
  "/Department",
  authMiddleware,
  checkRole("Admin"),
  departmentController.createDepartment,
);
router.get(
  "/Departments/:school",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  departmentController.getDepartments,
);
router.put(
  "/Department/:id",
  authMiddleware,
  checkRole("Admin"),
  departmentController.updateDepartment,
);
router.delete(
  "/Department/:id",
  authMiddleware,
  checkRole("Admin"),
  departmentController.deleteDepartment,
);

// Semester
router.post(
  "/Semester",
  authMiddleware,
  checkRole("Admin"),
  semesterController.createSemester,
);
router.get(
  "/Semesters/:department",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  semesterController.getSemesters,
);
router.put(
  "/Semester/:id",
  authMiddleware,
  checkRole("Admin"),
  semesterController.updateSemester,
);
router.delete(
  "/Semester/:id",
  authMiddleware,
  checkRole("Admin"),
  semesterController.deleteSemester,
);

//*Admin
router.get("/", (req, res) => {
  res.json({
    Message: "Server is running on port 5000",
    Backend: "backend is starting...",
    ProjectName: "School Management System",
  });
});
router.post("/AdminReg", adminRegister);
router.post(
  "/AdminLogin",
  authRateLimit,
  validateRequest(adminLoginSchema),
  adminLogIn,
);
router.post(
  "/AdminForgotPassword",
  authRateLimit,
  validateRequest(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/ForgotPassword",
  authRateLimit,
  validateRequest(forgotPasswordSchema),
  forgotPassword,
);
router.post(
  "/AdminResetPassword",
  validateRequest(resetPasswordSchema),
  resetPassword,
);

router.get(
  "/Admin/analytics",
  authMiddleware,
  checkRole("Admin"),
  analyticsController.getSchoolAnalytics,
);

router.get("/Admin/:id", authMiddleware, checkRole("Admin"), getAdminDetail);
// router.delete("/Admin/:id", deleteAdmin)

// router.put("/Admin/:id", updateAdmin)

// Student

router.post(
  "/StudentReg",
  authMiddleware,
  checkRole("Admin"),
  validateRequest(studentRegisterSchema),
  studentRegister,
);
router.post("/StudentLogin", authRateLimit, studentLogIn);

router.get(
  "/Students/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  getStudents,
);
router.get(
  "/Student/:id",
  authMiddleware,
  checkRole("Admin", "Student"),
  isOwnerOrAdmin(),
  getStudentDetail,
);

router.delete(
  "/Students/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteStudents,
);
router.delete(
  "/StudentsClass/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteStudentsByClass,
);
router.delete(
  "/Student/:id",
  authMiddleware,
  checkRole("Admin", "Student"),
  isOwnerOrAdmin(),
  deleteStudent,
);

router.put(
  "/Student/:id",
  authMiddleware,
  checkRole("Admin", "Student"),
  isOwnerOrAdmin(),
  updateStudent,
);

router.put(
  "/UpdateExamResult/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  updateExamResult,
);

router.put(
  "/StudentAttendance/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  studentAttendance,
);

router.put(
  "/RemoveAllStudentsSubAtten/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  clearAllStudentsAttendanceBySubject,
);
router.put(
  "/RemoveAllStudentsAtten/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  clearAllStudentsAttendance,
);

router.put(
  "/RemoveStudentSubAtten/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  removeStudentAttendanceBySubject,
);
router.put(
  "/RemoveStudentAtten/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  removeStudentAttendance,
);

// Teacher

router.post("/TeacherReg", authMiddleware, checkRole("Admin"), teacherRegister);
router.post("/TeacherLogin", teacherLogIn);

router.get("/Teachers/:id", authMiddleware, checkRole("Admin"), getTeachers);
router.get(
  "/Teacher/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  getTeacherDetail,
);

router.delete(
  "/Teachers/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteTeachers,
);
router.delete(
  "/TeachersClass/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteTeachersByClass,
);
router.delete(
  "/Teacher/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteTeacher,
);

router.put(
  "/TeacherSubject",
  authMiddleware,
  checkRole("Admin"),
  updateTeacherSubject,
);

router.post(
  "/TeacherAttendance/:id",
  authMiddleware,
  checkRole("Admin"),
  teacherAttendance,
);

// Notice

router.post("/NoticeCreate", authMiddleware, checkRole("Admin"), noticeCreate);

router.get(
  "/NoticeList/:id",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  noticeList,
);

router.delete(
  "/Notices/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteNotices,
);
router.delete("/Notice/:id", authMiddleware, checkRole("Admin"), deleteNotice);

router.put("/Notice/:id", authMiddleware, checkRole("Admin"), updateNotice);

// Complain

router.post(
  "/ComplainCreate",
  authMiddleware,
  checkRole("Teacher", "Student"),
  complainCreate,
);

router.get(
  "/ComplainList/:id",
  authMiddleware,
  checkRole("Admin"),
  complainList,
);

// Sclass

router.post("/SclassCreate", authMiddleware, checkRole("Admin"), sclassCreate);

router.get(
  "/SclassList/:id",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  sclassList,
);
router.get(
  "/Sclass/:id",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  getSclassDetail,
);

router.get(
  "/Sclass/Students/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  getSclassStudents,
);

router.delete(
  "/Sclasses/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteSclasses,
);
router.delete("/Sclass/:id", authMiddleware, checkRole("Admin"), deleteSclass);

// Subject

router.post(
  "/SubjectCreate",
  authMiddleware,
  checkRole("Admin"),
  validateRequest(createSubjectSchema),
  subjectCreate,
);

router.get(
  "/AllSubjects/:id",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  allSubjects,
);
router.get(
  "/ClassSubjects/:id",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  classSubjects,
);
router.get(
  "/FreeSubjectList/:id",
  authMiddleware,
  checkRole("Admin", "Teacher"),
  freeSubjectList,
);
router.get(
  "/Subject/:id",
  authMiddleware,
  checkRole("Admin", "Teacher", "Student"),
  getSubjectDetail,
);

router.delete(
  "/Subject/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteSubject,
);
router.delete(
  "/Subjects/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteSubjects,
);
router.delete(
  "/SubjectsClass/:id",
  authMiddleware,
  checkRole("Admin"),
  deleteSubjectsByClass,
);

module.exports = router;
