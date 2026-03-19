import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import bgpic from "../assets/designlogin.jpg";
import { LightPurpleButton } from "../components/buttonStyles";
import styled from "styled-components";
import { loginUser } from "../redux/userRelated/userHandle";

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, currentRole, loading } = useSelector(
    (state) => state.user,
  );

  const [toggle, setToggle] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (role === "Student") {
      const rollNum = event.target.rollNumber.value;
      const studentName = event.target.studentName.value;
      const password = event.target.password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password };
      dispatch(loginUser(fields, role));
    } else {
      const email = event.target.email.value;
      const password = event.target.password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      dispatch(loginUser(fields, role));
    }
  };

  const handleInputChange = (event) => {
    const { name } = event.target;
    if (name === "email") setEmailError(false);
    if (name === "password") setPasswordError(false);
    if (name === "rollNumber") setRollNumberError(false);
    if (name === "studentName") setStudentNameError(false);
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Student") {
        navigate("/Student/dashboard");
      } else if (currentRole === "Teacher") {
        navigate("/Teacher/dashboard");
      }
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 4 },
        py: 4,
        backgroundImage: `linear-gradient(135deg, rgba(2, 6, 23, 0.92), rgba(49, 46, 129, 0.72)), url(${bgpic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CssBaseline />
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1120,
          overflow: "hidden",
          borderRadius: 6,
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(15, 23, 42, 0.68)",
        }}
      >
        <Grid container>
          <Grid
            item
            md={6}
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              p: 6,
              color: "common.white",
              background:
                "linear-gradient(160deg, rgba(99,102,241,0.35), rgba(15,23,42,0.55))",
            }}
          >
            <Box>
              <Chip
                label="Professional School Operations"
                sx={{
                  mb: 3,
                  color: "common.white",
                  bgcolor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
              <Typography variant="h3" sx={{ mb: 2, maxWidth: 420 }}>
                Welcome back to your academic control center.
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.78)", maxWidth: 430 }}
              >
                Manage classes, attendance, results, fee workflows, notices, and
                faculty operations from a clean unified dashboard.
              </Typography>
            </Box>
            <Stack spacing={1.5} sx={{ maxWidth: 420 }}>
              <FeatureText>• Live notice updates with Socket.IO</FeatureText>
              <FeatureText>• Secure JWT-based role access</FeatureText>
              <FeatureText>
                • Cloud file storage and structured analytics
              </FeatureText>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                px: { xs: 3, sm: 5, md: 6 },
                py: { xs: 5, md: 6 },
                bgcolor: "background.paper",
                minHeight: { md: 720 },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <Chip
                  label={`${role} portal`}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2, fontWeight: 700 }}
                />
                <Typography variant="h4" sx={{ mb: 1.5 }}>
                  Sign in to continue
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                  Use your registered credentials to access the dashboard.
                </Typography>

                {role === "Student" ? (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="rollNumber"
                      label="Roll Number"
                      name="rollNumber"
                      autoComplete="off"
                      type="number"
                      autoFocus
                      size="medium"
                      error={rollNumberError}
                      helperText={rollNumberError && "Roll Number is required"}
                      onChange={handleInputChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="studentName"
                      label="Full Name"
                      name="studentName"
                      autoComplete="name"
                      size="medium"
                      error={studentNameError}
                      helperText={studentNameError && "Name is required"}
                      onChange={handleInputChange}
                    />
                  </>
                ) : (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    size="medium"
                    error={emailError}
                    helperText={emailError && "Email is required"}
                    onChange={handleInputChange}
                  />
                )}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={toggle ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  size="medium"
                  error={passwordError}
                  helperText={passwordError && "Password is required"}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setToggle(!toggle)}>
                          {toggle ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Grid
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  {role === "Admin" && (
                    <StyledLink to="/forgot-password">
                      Forgot password?
                    </StyledLink>
                  )}
                </Grid>
                <LightPurpleButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, py: 1.4, borderRadius: 3 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </LightPurpleButton>
                {role === "Admin" && (
                  <Grid container sx={{ mt: 2 }}>
                    <Grid>Don&apos;t have an account?</Grid>
                    <Grid item sx={{ ml: 2 }}>
                      <StyledLink to="/Adminregister">Sign up</StyledLink>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LoginPage;

const FeatureText = styled(Typography)`
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.98rem;
`;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #6366f1;
  font-weight: 700;
`;
