import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styled from "styled-components";
import bgpic from "../assets/designlogin.jpg";
import { LightPurpleButton } from "../components/buttonStyles";
import axios from "../api/axiosConfig";

const defaultTheme = createTheme();

const ResetPassword = ({ showNotification }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;

    if (!token) {
      showNotification?.("Reset token is missing.", "error");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/AdminResetPassword", {
        token,
        password,
      });
      showNotification?.(
        data.message || "Password reset successful. Please log in.",
        "success",
      );
      navigate("/Adminlogin");
    } catch (error) {
      showNotification?.(
        error.response?.data?.message || "Unable to reset password.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>
              Reset Password
            </Typography>
            <Typography align="center" sx={{ maxWidth: 420 }}>
              Enter a new password for your admin account.
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New password"
                type={showPassword ? "text" : "password"}
                value={password}
                error={Boolean(passwordError)}
                helperText={passwordError}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError("");
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                error={Boolean(confirmError)}
                helperText={confirmError}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setConfirmError("");
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <LightPurpleButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </LightPurpleButton>
              <Box sx={{ textAlign: "center" }}>
                <StyledLink to="/Adminlogin">Back to login</StyledLink>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${bgpic})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
    </ThemeProvider>
  );
};

export default ResetPassword;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #7f56da;
`;
