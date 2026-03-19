import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { ArrowBackRounded } from "@mui/icons-material";

const ErrorPage = ({
  title = "Page not found",
  message = "The page you are looking for is unavailable or may have been moved. You can go back safely and continue using the system.",
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "radial-gradient(circle at top, rgba(99,102,241,0.18), transparent 30%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 640,
          p: { xs: 4, md: 5 },
          borderRadius: 6,
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={2.5} alignItems="center">
          <Box
            sx={{
              width: 74,
              height: 74,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(99,102,241,0.14)",
              color: "primary.main",
              fontSize: "1.65rem",
              fontWeight: 800,
            }}
          >
            404
          </Box>
          <Typography variant="h4">{title}</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
            {message}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackRounded />}
            onClick={handleGoBack}
            sx={{ px: 3, py: 1.2 }}
          >
            Go Back
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ErrorPage;
