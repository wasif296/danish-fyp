import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Paper } from "@mui/material";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import EmptyState from "../../../components/EmptyState";
import Popup from "../../../components/Popup";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import TableSkeleton from "../../../components/TableSkeleton";
import TableTemplate from "../../../components/TableTemplate";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "teachSubject", label: "Subject", minWidth: 100 },
  { id: "teachSclass", label: "Class", minWidth: 170 },
];

const ShowTeachers = ({ showNotification }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teachersList, loading, error, response, pagination } = useSelector(
    (state) => state.teacher,
  );
  const { currentUser } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(
      getAllTeachers(currentUser._id, {
        page: page + 1,
        limit: rowsPerPage,
      }),
    );
  }, [currentUser._id, dispatch, page, rowsPerPage]);

  const deleteHandler = () => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
    showNotification?.(
      "Sorry, the delete function has been disabled for now.",
      "warning",
    );
  };

  if (error) {
    console.log(error);
  }

  const rows = Array.isArray(teachersList)
    ? teachersList.map((teacher) => ({
        name: teacher.name,
        teachSubject: teacher.teachSubject?.subName || (
          <Button
            variant="contained"
            onClick={() => {
              navigate(
                `/Admin/teachers/choosesubject/${teacher.teachSclass?._id}/${teacher._id}`,
              );
            }}
          >
            Add Subject
          </Button>
        ),
        teachSclass: teacher.teachSclass?.sclassName || "Not assigned",
        teachSclassID: teacher.teachSclass?._id,
        id: teacher._id,
      }))
    : [];

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Teacher",
      action: () => navigate("/Admin/teachers/chooseclass"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Teachers",
      action: () => deleteHandler(currentUser._id, "Teachers"),
    },
  ];

  const TeacherButtonHaver = ({ row }) => (
    <>
      <IconButton onClick={() => deleteHandler(row.id, "Teacher")}>
        <PersonRemoveIcon color="error" />
      </IconButton>
      <BlueButton
        variant="contained"
        onClick={() => navigate(`/Admin/teachers/teacher/${row.id}`)}
      >
        View
      </BlueButton>
    </>
  );

  if (loading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableSkeleton
          columns={columns}
          rows={rowsPerPage}
          showSearch={false}
        />
      </Paper>
    );
  }

  if (response) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        <EmptyState
          icon={<Groups2RoundedIcon />}
          title="No teachers assigned yet"
          description="Add your first teacher to begin assigning classes and subjects."
          action={
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/teachers/chooseclass")}
              aria-label="Add Teacher"
            >
              Add Teacher
            </GreenButton>
          }
        />
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableTemplate
        buttonHaver={TeacherButtonHaver}
        columns={columns}
        rows={rows}
        serverSide
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={pagination.total}
        onPageChange={(_event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(_event, newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        emptyMessage="No teachers found."
        emptyStateProps={{
          icon: <Groups2RoundedIcon />,
          title: "No teachers found",
          description:
            "Teacher records will appear here after they are added to the school.",
        }}
      />
      <SpeedDialTemplate actions={actions} />
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </Paper>
  );
};

export default ShowTeachers;
