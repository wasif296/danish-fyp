import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Notification = ({ open, message, severity = "info", onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={(event, reason) => {
      if (reason === "clickaway") return;
      onClose?.(event, reason);
    }}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default Notification;
