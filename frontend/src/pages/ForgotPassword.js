import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  CircularProgress,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";
import bgpic from "../assets/designlogin.jpg";
import { LightPurpleButton } from "../components/buttonStyles";
import axios from "../api/axiosConfig";

const defaultTheme = createTheme();

const ForgotPassword = ({ showNotification }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setEmailError(true);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/AdminForgotPassword", {
        email: email.trim(),
      });
      showNotification?.(
        data.message || "If the email exists, a reset link has been sent.",
        "success",
      );
      setEmail("");
    } catch (error) {
      showNotification?.(
        error.response?.data?.message || "Unable to send reset email.",
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
              Forgot Password
            </Typography>
            <Typography align="center" sx={{ maxWidth: 420 }}>
              Enter your admin email address and we will send you a password
              reset link.
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
                id="email"
                label="Admin email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                error={emailError}
                helperText={emailError ? "Email is required" : ""}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError(false);
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
                  "Send Reset Link"
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

export default ForgotPassword;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #7f56da;
`;
