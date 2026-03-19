import { useEffect, useState } from "react";
import { Box, LinearProgress, alpha } from "@mui/material";

const NavigationProgress = ({ pathname }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    let finishTimer;
    let hideTimer;

    setVisible(true);
    setProgress(14);

    frame = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 88) {
          return current;
        }

        return current + Math.max(3, (90 - current) / 5);
      });
    }, 90);

    finishTimer = window.setTimeout(() => {
      window.clearInterval(frame);
      setProgress(100);
      hideTimer = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }, 420);

    return () => {
      window.clearInterval(frame);
      window.clearTimeout(finishTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.snackbar + 2,
        opacity: visible ? 1 : 0,
        transition: "opacity 180ms ease",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.14),
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
          },
        }}
      />
    </Box>
  );
};

export default NavigationProgress;
