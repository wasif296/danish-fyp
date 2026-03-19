import { useEffect } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import axios from "../../api/axiosConfig";
import {
  Paper,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import { BlackButton, BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassStudents, loading, error, getresponse } = useSelector(
    (state) => state.sclass,
  );

  const { currentUser } = useSelector((state) => state.user);
  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;
  const [submissionLoading, setSubmissionLoading] = React.useState(false);
  const [assignmentCount, setAssignmentCount] = React.useState(0);
  const [submissionStatusMap, setSubmissionStatusMap] = React.useState({});

  useEffect(() => {
    if (classID) {
      dispatch(getClassStudents(classID));
    }
  }, [dispatch, classID]);

  useEffect(() => {
    const loadSubmissionStatus = async () => {
      if (!classID || !subjectID) {
        setAssignmentCount(0);
        setSubmissionStatusMap({});
        return;
      }

      setSubmissionLoading(true);

      try {
        const assignmentsResponse = await axios.get("/Assignments", {
          params: {
            course: subjectID,
            sclass: classID,
          },
        });

        const assignments = Array.isArray(assignmentsResponse.data)
          ? assignmentsResponse.data
          : [];

        setAssignmentCount(assignments.length);

        if (assignments.length === 0) {
          setSubmissionStatusMap({});
          return;
        }

        const submissionsResponses = await Promise.all(
          assignments.map((assignment) =>
            axios.get("/AssignmentSubmissions", {
              params: { assignment: assignment._id },
            }),
          ),
        );

        const statusMap = {};

        submissionsResponses.forEach((response, index) => {
          const assignment = assignments[index];
          const submissions = Array.isArray(response.data) ? response.data : [];

          submissions.forEach((submission) => {
            const studentId = submission.student?._id || submission.student;
            const submittedAt = submission.submittedAt || submission.createdAt;

            if (!studentId) {
              return;
            }

            if (!statusMap[studentId]) {
              statusMap[studentId] = {
                submittedCount: 0,
                latestSubmittedAt: null,
                latestAssignmentTitle: "",
              };
            }

            statusMap[studentId].submittedCount += 1;

            const currentTimestamp = submittedAt
              ? new Date(submittedAt).getTime()
              : 0;
            const existingTimestamp = statusMap[studentId].latestSubmittedAt
              ? new Date(statusMap[studentId].latestSubmittedAt).getTime()
              : 0;

            if (currentTimestamp >= existingTimestamp) {
              statusMap[studentId].latestSubmittedAt = submittedAt;
              statusMap[studentId].latestAssignmentTitle =
                assignment?.title || "Assignment";
            }
          });
        });

        setSubmissionStatusMap(statusMap);
      } catch (submissionError) {
        console.error(submissionError);
        setSubmissionStatusMap({});
      } finally {
        setSubmissionLoading(false);
      }
    };

    loadSubmissionStatus();
  }, [classID, subjectID]);

  if (error) {
    console.log(error);
  }

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
    { id: "submissionStatus", label: "Assignment Status", minWidth: 180 },
    { id: "submissionDetails", label: "Submission Details", minWidth: 220 },
  ];

  const studentRows = sclassStudents.map((student) => {
    const submissionStatus = submissionStatusMap[student._id];
    const hasSubmission = Boolean(submissionStatus);
    const statusLabel =
      assignmentCount === 0
        ? "No assignments yet"
        : hasSubmission
          ? "Submitted"
          : "Not submitted";

    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
      submissionStatus: (
        <Chip
          label={statusLabel}
          color={
            assignmentCount === 0
              ? "default"
              : hasSubmission
                ? "success"
                : "warning"
          }
          variant={hasSubmission ? "filled" : "outlined"}
          size="small"
        />
      ),
      submissionDetails:
        assignmentCount === 0
          ? "Waiting for first assignment"
          : hasSubmission
            ? `${submissionStatus.submittedCount} submission(s) • Last: ${new Date(
                submissionStatus.latestSubmittedAt,
              ).toLocaleString()}`
            : "Pending submission",
    };
  });

  const StudentsButtonHaver = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`);
    };
    const handleMarks = () => {
      navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`);
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Teacher/class/student/" + row.id)}
        >
          View
        </BlueButton>
        <React.Fragment>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="split button"
          >
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <BlackButton
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </BlackButton>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      </>
    );
  };

  return (
    <>
      {loading || submissionLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Class Details
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Chip
                label={`Assignments in this subject: ${assignmentCount}`}
                color="primary"
                variant="outlined"
              />
              {assignmentCount > 0 && (
                <Chip
                  label={`Submitted: ${sclassStudents.filter((student) => Boolean(submissionStatusMap[student._id])).length}`}
                  color="success"
                  variant="outlined"
                />
              )}
              {assignmentCount > 0 && (
                <Chip
                  label={`Pending: ${sclassStudents.filter((student) => !submissionStatusMap[student._id]).length}`}
                  color="warning"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
          {getresponse ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                No Students Found
              </Box>
            </>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <Typography variant="h5" gutterBottom>
                Students List:
              </Typography>

              {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                <TableTemplate
                  buttonHaver={StudentsButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                />
              )}
            </Paper>
          )}
        </>
      )}
    </>
  );
};

export default TeacherClassDetails;
