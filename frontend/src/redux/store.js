import contentReducer from "./contentRelated/contentSlice";
import submissionReducer from "./submissionRelated/submissionSlice";
import { configureStore } from "@reduxjs/toolkit";

import { userReducer } from "./userRelated/userSlice";
import { studentReducer } from "./studentRelated/studentSlice";
import { noticeReducer } from "./noticeRelated/noticeSlice";
import { sclassReducer } from "./sclassRelated/sclassSlice";
import { teacherReducer } from "./teacherRelated/teacherSlice";
import { complainReducer } from "./complainRelated/complainSlice";

import { departmentReducer } from "./departmentRelated/departmentSlice";

import { feeVoucherReducer } from "./feeVoucherRelated/feeVoucherSlice";

import { notificationReducer } from "./notificationRelated/notificationSlice";

import { semesterReducer } from "./semesterRelated/semesterSlice";

import { timetableReducer } from "./timetableRelated/timetableSlice";
import { assignmentReducer } from "./assignmentRelated/assignmentSlice";
import quizReducer from "./quizRelated/quizSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    student: studentReducer,
    teacher: teacherReducer,
    quiz: quizReducer,
    notice: noticeReducer,
    complain: complainReducer,
    sclass: sclassReducer,
    department: departmentReducer,
    feeVoucher: feeVoucherReducer,
    notification: notificationReducer,
    semester: semesterReducer,
    timetable: timetableReducer,
    assignment: assignmentReducer,
    submission: submissionReducer,
    content: contentReducer,
  },
});

export default store;
