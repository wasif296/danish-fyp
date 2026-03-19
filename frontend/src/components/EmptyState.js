import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const EmptyState = ({
  icon,
  title = "Nothing to show yet",
  description = "Content will appear here once records are available.",
  action = null,
  minHeight = 220,
  compact = false,
}) => {
  return (
    <Box
      sx={{
        minHeight,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: compact ? 2 : 4,
      }}
    >
      <Stack
        spacing={1.5}
        alignItems="center"
        textAlign="center"
        maxWidth={420}
      >
        <Box
          sx={{
            width: compact ? 58 : 72,
            height: compact ? 58 : 72,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
            color: "primary.main",
            border: "1px solid",
            borderColor: "divider",
            "& svg": {
              fontSize: compact ? 28 : 34,
            },
          }}
        >
          {icon}
        </Box>
        <Typography variant={compact ? "h6" : "h5"} sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
        {action}
      </Stack>
    </Box>
  );
};

export default EmptyState;
