import React from "react";
import {
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Box,
} from "@mui/material";

const StudentProfilePage = () => {
  // Replace with real student data and update logic
  const [edit, setEdit] = React.useState(false);
  const [profile, setProfile] = React.useState({
    name: "Student Name",
    email: "student@email.com",
    phone: "5555555555",
    avatar: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEdit(true);
  const handleSave = () => setEdit(false); // Add save logic

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar sx={{ width: 80, height: 80 }} src={profile.avatar} />
        {edit ? (
          <>
            <TextField
              label="Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6">{profile.name}</Typography>
            <Typography color="text.secondary">{profile.email}</Typography>
            <Typography color="text.secondary">{profile.phone}</Typography>
            <Button variant="outlined" onClick={handleEdit}>
              Edit Profile
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default StudentProfilePage;
