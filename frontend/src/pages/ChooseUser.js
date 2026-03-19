import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Box, Container } from "@mui/material";
import { AccountCircle, School, Group } from "@mui/icons-material";
import styled from "styled-components";

const ChooseUser = ({ visitor, showNotification }) => {
  const navigate = useNavigate();

  const navigateHandler = (user) => {
    if (visitor === "guest" && showNotification) {
      showNotification("Guest/demo access has been removed.", "info");
    }

    if (user === "Admin") {
      navigate("/Adminlogin");
    } else if (user === "Student") {
      navigate("/Studentlogin");
    } else if (user === "Teacher") {
      navigate("/Teacherlogin");
    }
  };

  return (
    <StyledContainer>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <div onClick={() => navigateHandler("Admin")}>
              <StyledPaper elevation={3}>
                <Box mb={2}>
                  <AccountCircle fontSize="large" />
                </Box>
                <StyledTypography>Admin</StyledTypography>
                Login as an administrator to access the dashboard to manage app
                data.
              </StyledPaper>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={3}>
              <div onClick={() => navigateHandler("Student")}>
                <Box mb={2}>
                  <School fontSize="large" />
                </Box>
                <StyledTypography>Student</StyledTypography>
                Login as a student to explore course materials and assignments.
              </div>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper elevation={3}>
              <div onClick={() => navigateHandler("Teacher")}>
                <Box mb={2}>
                  <Group fontSize="large" />
                </Box>
                <StyledTypography>Teacher</StyledTypography>
                Login as a teacher to create courses, assignments, and track
                student progress.
              </div>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(to bottom, #411d70, #19118b);
  height: 120vh;
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const StyledPaper = styled(Paper)`
  padding: 20px;
  text-align: center;
  background-color: #1f1f38;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;

  &:hover {
    background-color: #2c2c6c;
    color: white;
  }
`;

const StyledTypography = styled.h2`
  margin-bottom: 10px;
`;
