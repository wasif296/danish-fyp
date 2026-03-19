import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSemesters } from "../../../redux/semesterRelated/semesterHandle";
import { Paper, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowSemesters = ({ showNotification }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { semesters, loading, error } = useSelector((state) => state.semester);

  useEffect(() => {
    dispatch(fetchSemesters());
  }, [dispatch]);

  // const [showPopup, setShowPopup] = useState(false);
  // const [message, setMessage] = useState("");

  const deleteHandler = (deleteID) => {
    showNotification &&
      showNotification(
        "Sorry, the delete function has been disabled for now.",
        "warning",
      );
  };

  const semesterColumns = [
    { id: "name", label: "Semester Name", minWidth: 170 },
    { id: "department", label: "Department", minWidth: 170 },
  ];

  const semesterRows =
    semesters && semesters.length > 0
      ? semesters.map((sem) => ({
          name: sem.name,
          department: sem.department?.name || "N/A",
          id: sem._id,
        }))
      : [];

  const SemesterButtonHaver = ({ row }) => (
    <>
      <IconButton onClick={() => deleteHandler(row.id)}>
        <DeleteIcon color="error" />
      </IconButton>
      <BlueButton
        variant="contained"
        onClick={() => navigate(`/Admin/semesters/semester/${row.id}`)}
      >
        View
      </BlueButton>
    </>
  );

  const actions = [
    {
      icon: <GreenButton variant="contained">Add Semester</GreenButton>,
      name: "Add New Semester",
      action: () => navigate("/Admin/semesters/add"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Semesters",
      action: () =>
        showNotification &&
        showNotification(
          "Sorry, the delete function has been disabled for now.",
          "warning",
        ),
    },
  ];

  return (
    <>
      {loading ? (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      ) : (
        <>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {Array.isArray(semesterRows) && semesterRows.length > 0 && (
              <TableTemplate
                buttonHaver={SemesterButtonHaver}
                columns={semesterColumns}
                rows={semesterRows}
              />
            )}
            <SpeedDialTemplate actions={actions} />
          </Paper>
        </>
      )}
      {/* Notification handled globally */}
    </>
  );
};

export default ShowSemesters;
