import { Box, Container, Grid, Paper } from "@mui/material";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import SeeNotice from "../../components/SeeNotice";
import CountUp from "react-countup";
import styled from "styled-components";
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";
import Time from "../../assets/time.svg";
import axios from "../../api/axiosConfig";
import {
  getClassStudents,
  getSubjectDetails,
} from "../../redux/sclassRelated/sclassHandle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CardSkeleton from "../../components/CardSkeleton";
import EmptyState from "../../components/EmptyState";

const TeacherHomePage = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { subjectDetails, sclassStudents, loading, subloading } = useSelector(
    (state) => state.sclass,
  );
  const [assignmentStats, setAssignmentStats] = useState({
    totalAssignments: 0,
    pendingGrading: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  useEffect(() => {
    let isMounted = true;

    const loadTeacherStats = async () => {
      if (!classID || !subjectID) {
        if (isMounted) {
          setStatsLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setStatsLoading(true);
        }
        const { data: assignments } = await axios.get("/Assignments", {
          params: {
            course: subjectID,
            sclass: classID,
          },
        });

        const assignmentList = Array.isArray(assignments) ? assignments : [];

        const submissionsList = await Promise.all(
          assignmentList.map((assignment) =>
            axios.get("/AssignmentSubmissions", {
              params: { assignment: assignment._id },
            }),
          ),
        );

        const pendingGrading = submissionsList.reduce((count, response) => {
          const submissions = Array.isArray(response.data) ? response.data : [];

          return (
            count +
            submissions.filter(
              (submission) =>
                submission.marks === undefined || submission.marks === null,
            ).length
          );
        }, 0);

        if (isMounted) {
          setAssignmentStats({
            totalAssignments: assignmentList.length,
            pendingGrading,
          });
        }
      } catch (_error) {
        if (isMounted) {
          setAssignmentStats({
            totalAssignments: 0,
            pendingGrading: 0,
          });
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    loadTeacherStats();

    return () => {
      isMounted = false;
    };
  }, [classID, subjectID]);

  const numberOfStudents = sclassStudents && sclassStudents.length;
  const numberOfSessions = subjectDetails && subjectDetails.sessions;
  const totalAssignments = assignmentStats.totalAssignments;
  const pendingGrading = assignmentStats.pendingGrading;
  const totalHours = Number.parseInt(numberOfSessions, 10) || 0;
  const dashboardLoading = loading || subloading || statsLoading;
  const hasStudents =
    Array.isArray(sclassStudents) && sclassStudents.length > 0;

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {dashboardLoading ? (
          <CardSkeleton count={4} />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} lg={3}>
              <StyledPaper>
                <img src={Students} alt="Students" />
                <Title>Class Students</Title>
                <Data start={0} end={numberOfStudents} duration={2.5} />
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <StyledPaper>
                <img src={Lessons} alt="Lessons" />
                <Title>Total Lessons</Title>
                <Data start={0} end={numberOfSessions} duration={5} />
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <StyledPaper>
                <img src={Tests} alt="Tests" />
                <Title>Assignments Created</Title>
                <Data start={0} end={totalAssignments} duration={4} />
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <StyledPaper>
                <img src={Time} alt="Time" />
                <Title>Pending Grading</Title>
                <Data start={0} end={pendingGrading} duration={4} />
                <SubText>{totalHours} planned lesson hours</SubText>
              </StyledPaper>
            </Grid>
            {!hasStudents && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <EmptyState
                    icon={<Groups2RoundedIcon />}
                    title="This class has no students yet"
                    description="Once students are enrolled into the assigned class, they will appear here and in your teaching workflows."
                    minHeight={180}
                    compact
                  />
                </Paper>
              </Grid>
            )}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Box sx={{ px: 1, pt: 1 }}>
                  <SectionTitle>Latest Notices</SectionTitle>
                </Box>
                <SeeNotice />
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + 0.6vw);
  color: green;
`;

const SubText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #5f5f73;
`;

const SectionTitle = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
`;

export default TeacherHomePage;
