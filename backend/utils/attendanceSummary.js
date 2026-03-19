const roundPercentage = (value) => Number((value || 0).toFixed(2));

const buildStudentAttendanceSummary = (attendance = []) => {
  const subjectMap = new Map();
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalRecordedSessions = 0;

  attendance.forEach((entry) => {
    const subject = entry?.subName || {};
    const subjectId = String(subject?._id || entry?.subName || "");

    if (!subjectId) {
      return;
    }

    const existing = subjectMap.get(subjectId) || {
      subjectId,
      subjectName: subject?.subName || "Unknown Subject",
      scheduledSessions: Number(subject?.sessions || 0),
      present: 0,
      absent: 0,
      recordedSessions: 0,
    };

    if (entry?.status === "Present") {
      existing.present += 1;
      totalPresent += 1;
    } else if (entry?.status === "Absent") {
      existing.absent += 1;
      totalAbsent += 1;
    }

    existing.recordedSessions += 1;
    totalRecordedSessions += 1;
    subjectMap.set(subjectId, existing);
  });

  const subjects = Array.from(subjectMap.values()).map((subject) => ({
    ...subject,
    attendancePercentage: roundPercentage(
      subject.recordedSessions
        ? (subject.present / subject.recordedSessions) * 100
        : 0,
    ),
  }));

  return {
    totalPresent,
    totalAbsent,
    totalRecordedSessions,
    overallAttendancePercentage: roundPercentage(
      totalRecordedSessions ? (totalPresent / totalRecordedSessions) * 100 : 0,
    ),
    subjects,
  };
};

const buildTeacherAttendanceSummary = (attendance = []) => {
  const totalDays = attendance.length;
  const presentDays = attendance.filter(
    (entry) => entry?.status === "Present",
  ).length;
  const absentDays = attendance.filter(
    (entry) => entry?.status === "Absent",
  ).length;

  return {
    totalDays,
    presentDays,
    absentDays,
    attendancePercentage: roundPercentage(
      totalDays ? (presentDays / totalDays) * 100 : 0,
    ),
  };
};

module.exports = {
  buildStudentAttendanceSummary,
  buildTeacherAttendanceSummary,
};
