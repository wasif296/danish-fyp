import React from "react";
import { Grid, Paper, Skeleton, Stack } from "@mui/material";

const CardSkeleton = ({ count = 4, includeCharts = false }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} md={3} key={`card-${index}`}>
          <Paper sx={{ p: 2.5, minHeight: 190 }}>
            <Stack spacing={2} alignItems="center">
              <Skeleton variant="rounded" width={64} height={64} />
              <Skeleton variant="text" width="70%" height={34} />
              <Skeleton variant="text" width="45%" height={54} />
              <Skeleton variant="text" width="82%" />
            </Stack>
          </Paper>
        </Grid>
      ))}

      {includeCharts && (
        <>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, minHeight: 420 }}>
              <Skeleton variant="text" width={180} height={40} />
              <Skeleton
                variant="rounded"
                width="100%"
                height={320}
                sx={{ mt: 2 }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, minHeight: 420 }}>
              <Skeleton variant="text" width={160} height={40} />
              <Skeleton
                variant="rounded"
                width="100%"
                height={320}
                sx={{ mt: 2 }}
              />
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CardSkeleton;
