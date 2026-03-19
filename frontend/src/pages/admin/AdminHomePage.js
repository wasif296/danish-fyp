import { Container, Grid, Paper, Typography, Box, Stack } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CampaignIcon from "@mui/icons-material/Campaign";
import SeeNotice from "../../components/SeeNotice";
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import styled from "styled-components";
import CountUp from "react-countup";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import CustomPieChart from "../../components/CustomPieChart";
import CustomBarChart from "../../components/CustomBarChart";
import CardSkeleton from "../../components/CardSkeleton";
import EmptyState from "../../components/EmptyState";
import {
  BlueButton,
  GreenButton,
  LightPurpleButton,
} from "../../components/buttonStyles";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [analytics, setAnalytics] = useState({
    totals: {
      students: 0,
      teachers: 0,
      classes: 0,
    },
    averageAttendancePercentage: 0,
    complaintBreakdown: {
      pending: 0,
      resolved: 0,
    },
    charts: {
      counts: [],
      complaints: [],
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      if (!currentUser?._id) {
        return;
      }

      setLoading(true);

      try {
        const { data } = await axios.get("/Analytics/overview");

        if (isMounted) {
          setAnalytics(data);
        }
      } catch (_error) {
        if (isMounted) {
          setAnalytics((previousAnalytics) => ({
            ...previousAnalytics,
            charts: {
              counts: [],
              complaints: [],
            },
          }));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, [currentUser?._id]);

  const countsChartData = useMemo(
    () =>
      (analytics?.charts?.counts || []).map((item) => ({
        subject: item.name,
        value: item.value,
      })),
    [analytics],
  );

  const complaintChartData = useMemo(
    () => analytics?.charts?.complaints || [],
    [analytics],
  );

  const totalStudents = analytics?.totals?.students || 0;
  const totalTeachers = analytics?.totals?.teachers || 0;
  const totalClasses = analytics?.totals?.classes || 0;
  const pendingComplaints = analytics?.complaintBreakdown?.pending || 0;
  const resolvedComplaints = analytics?.complaintBreakdown?.resolved || 0;
  const totalComplaints = pendingComplaints + resolvedComplaints;
  const averageAttendance = analytics?.averageAttendancePercentage || 0;
  const hasCountData = countsChartData.some(
    (item) => Number(item?.value || 0) > 0,
  );
  const hasComplaintData = complaintChartData.some(
    (item) => Number(item?.value || 0) > 0,
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <CardSkeleton count={5} includeCharts />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StyledPaper>
              <img src={Students} alt="Students" />
              <Title>Total Students</Title>
              <Data start={0} end={totalStudents} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledPaper>
              <img src={Teachers} alt="Teachers" />
              <Title>Total Teachers</Title>
              <Data start={0} end={totalTeachers} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledPaper>
              <img src={Classes} alt="Classes" />
              <Title>Total Classes</Title>
              <Data start={0} end={totalClasses} duration={2.5} />
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledPaper>
              <Title>Avg Attendance</Title>
              <Data
                start={0}
                end={averageAttendance}
                duration={2.5}
                decimals={2}
                suffix="%"
              />
              <SubText>School-wide student attendance average</SubText>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledPaper>
              <Title>Total Complaints</Title>
              <Data start={0} end={totalComplaints} duration={2.5} />
              <SubText>
                {pendingComplaints} pending • {resolvedComplaints} resolved
              </SubText>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, minHeight: 420 }}>
              <SectionTitle>Complaint Breakdown</SectionTitle>
              {hasComplaintData ? (
                <CustomPieChart data={complaintChartData} />
              ) : (
                <EmptyState
                  icon={<QueryStatsRoundedIcon />}
                  title="No complaint analytics yet"
                  description="Complaint charts will appear once the school starts receiving and resolving complaint records."
                  compact
                  minHeight={300}
                />
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, minHeight: 420 }}>
              <SectionTitle>School Counts</SectionTitle>
              {hasCountData ? (
                <CustomBarChart chartData={countsChartData} dataKey="value" />
              ) : (
                <EmptyState
                  icon={<QueryStatsRoundedIcon />}
                  title="No count analytics yet"
                  description="Summary charts will appear after classes, teachers, and students are added."
                  compact
                  minHeight={300}
                />
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, minHeight: 260 }}>
              <SectionTitle>Quick Actions</SectionTitle>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <LightPurpleButton
                  variant="contained"
                  startIcon={<PersonAddAlt1Icon />}
                  onClick={() => navigate("/Admin/addstudents")}
                >
                  Add New Student
                </LightPurpleButton>
                <GreenButton
                  variant="contained"
                  startIcon={<CampaignIcon />}
                  onClick={() => navigate("/Admin/addnotice")}
                >
                  Post Notice
                </GreenButton>
                <BlueButton
                  variant="contained"
                  onClick={() => navigate("/Admin/complains")}
                >
                  Review Complaints
                </BlueButton>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                minHeight: 260,
              }}
            >
              <Box sx={{ px: 1, pt: 1 }}>
                <SectionTitle>Latest Notices</SectionTitle>
              </Box>
              <SeeNotice />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
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

const SectionTitle = styled(Typography).attrs({
  variant: "h6",
})`
  font-weight: 700;
  color: #1f1f38;
`;

const SubText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #5f5f73;
`;

export default AdminHomePage;
