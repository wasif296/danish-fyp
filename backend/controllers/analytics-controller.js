const mongoose = require("mongoose");
const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Complain = require("../models/complainSchema.js");
const {
  getCachedAnalytics,
  setCachedAnalytics,
} = require("../utils/analyticsCache.js");

const roundPercentage = (value) => Number((value || 0).toFixed(2));

const buildComplaintSummary = (complaintStats = []) => {
  const summary = complaintStats.reduce(
    (accumulator, item) => {
      const normalizedStatus = String(item._id || "pending").toLowerCase();

      if (normalizedStatus === "resolved") {
        accumulator.resolved += item.count;
      } else {
        accumulator.pending += item.count;
      }

      return accumulator;
    },
    { pending: 0, resolved: 0 },
  );

  return summary;
};

exports.getSchoolAnalytics = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const schoolId = req.user._id;
    const cachedAnalytics = getCachedAnalytics(schoolId);

    if (cachedAnalytics) {
      return res.json(cachedAnalytics);
    }

    const schoolObjectId = new mongoose.Types.ObjectId(schoolId);

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      attendanceStats,
      complaintStats,
    ] = await Promise.all([
      Student.countDocuments({ school: schoolObjectId }),
      Teacher.countDocuments({ school: schoolObjectId }),
      Sclass.countDocuments({ school: schoolObjectId }),
      Student.aggregate([
        { $match: { school: schoolObjectId } },
        { $unwind: "$attendance" },
        {
          $group: {
            _id: null,
            totalRecorded: { $sum: 1 },
            totalPresent: {
              $sum: {
                $cond: [{ $eq: ["$attendance.status", "Present"] }, 1, 0],
              },
            },
          },
        },
      ]),
      Complain.aggregate([
        { $match: { school: schoolObjectId } },
        {
          $project: {
            normalizedStatus: {
              $toLower: { $ifNull: ["$status", "Pending"] },
            },
          },
        },
        {
          $group: {
            _id: "$normalizedStatus",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const attendanceSummary = attendanceStats[0] || {
      totalRecorded: 0,
      totalPresent: 0,
    };
    const averageAttendancePercentage = roundPercentage(
      attendanceSummary.totalRecorded
        ? (attendanceSummary.totalPresent / attendanceSummary.totalRecorded) *
            100
        : 0,
    );
    const complaints = buildComplaintSummary(complaintStats);

    const analyticsPayload = {
      totals: {
        students: totalStudents,
        teachers: totalTeachers,
        classes: totalClasses,
      },
      averageAttendancePercentage,
      complaintBreakdown: complaints,
      charts: {
        counts: [
          { name: "Students", value: totalStudents },
          { name: "Teachers", value: totalTeachers },
          { name: "Classes", value: totalClasses },
        ],
        complaints: [
          { name: "Pending", value: complaints.pending },
          { name: "Resolved", value: complaints.resolved },
        ],
      },
    };

    setCachedAnalytics(schoolId, analyticsPayload);

    return res.json(analyticsPayload);
  } catch (error) {
    next(error);
  }
};
