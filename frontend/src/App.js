import React, { useMemo } from "react";
import Notification from "./components/Notification";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/LoginPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import ChooseUser from "./pages/ChooseUser";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ErrorPage from "./components/ErrorPage";
import NavigationProgress from "./components/NavigationProgress";
import useSocket from "./hooks/useSocket";
import {
  clearMessage,
  setMessage,
  toggleDarkMode,
} from "./redux/userRelated/userSlice";
import { getAppTheme } from "./components/styles";

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentRole, message, messageSeverity, darkMode } = useSelector(
    (state) => state.user,
  );

  const showNotification = (message, severity = "info") => {
    dispatch(
      setMessage({
        text: message,
        severity,
      }),
    );
  };

  const handleNotifClose = () => {
    dispatch(clearMessage());
  };

  useSocket("new_notice", () => {
    showNotification("New Notice Posted!", "success");
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <NavigationProgress pathname={location.pathname} />
      <Tooltip
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <IconButton
          onClick={() => dispatch(toggleDarkMode())}
          sx={{
            position: "fixed",
            top: 18,
            right: 18,
            zIndex: (theme) => theme.zIndex.tooltip + 1,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: 6,
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          {darkMode ? <LightModeRounded /> : <DarkModeRounded />}
        </IconButton>
      </Tooltip>
      <Notification
        open={Boolean(message)}
        message={message}
        severity={messageSeverity}
        onClose={handleNotifClose}
      />
      {currentRole === null && (
        <Routes>
          <Route
            path="/"
            element={<Homepage showNotification={showNotification} />}
          />
          <Route
            path="/choose"
            element={
              <ChooseUser
                visitor="normal"
                showNotification={showNotification}
              />
            }
          />
          <Route
            path="/chooseasguest"
            element={
              <ChooseUser visitor="guest" showNotification={showNotification} />
            }
          />

          <Route
            path="/Adminlogin"
            element={
              <LoginPage role="Admin" showNotification={showNotification} />
            }
          />
          <Route
            path="/Studentlogin"
            element={
              <LoginPage role="Student" showNotification={showNotification} />
            }
          />
          <Route
            path="/Teacherlogin"
            element={
              <LoginPage role="Teacher" showNotification={showNotification} />
            }
          />

          <Route
            path="/Adminregister"
            element={<AdminRegisterPage showNotification={showNotification} />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword showNotification={showNotification} />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword showNotification={showNotification} />}
          />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      )}

      {currentRole === "Admin" && (
        <>
          <AdminDashboard showNotification={showNotification} />
        </>
      )}

      {currentRole === "Student" && (
        <>
          <StudentDashboard showNotification={showNotification} />
        </>
      )}

      {currentRole === "Teacher" && (
        <>
          <TeacherDashboard showNotification={showNotification} />
        </>
      )}
    </Box>
  );
};

const App = () => {
  const darkMode = useSelector((state) => state.user.darkMode);
  const theme = useMemo(() => getAppTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
