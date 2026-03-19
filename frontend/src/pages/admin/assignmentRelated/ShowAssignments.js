import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAssignments } from "../../../redux/assignmentRelated/assignmentHandle";
import { Paper, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowAssignments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector(
    (state) => state.assignment,
  );

  useEffect(() => {
    dispatch(fetchAssignments());
  }, [dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const assignmentColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "subject", label: "Subject", minWidth: 170 },
    { id: "dueDate", label: "Due Date", minWidth: 120 },
  ];

  const assignmentRows =
    assignments && assignments.length > 0
      ? assignments.map((a) => ({
          title: a.title,
          subject: a.subject?.subName || "N/A",
          dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "",
          id: a._id,
        }))
      : [];

  const AssignmentButtonHaver = ({ row }) => (
    <>
      <IconButton onClick={() => deleteHandler(row.id)}>
        <DeleteIcon color="error" />
      </IconButton>
      <BlueButton
        variant="contained"
        onClick={() => navigate(`/Admin/assignments/assignment/${row.id}`)}
      >
        View
      </BlueButton>
    </>
  );

  const actions = [
    {
      icon: <GreenButton variant="contained">Add Assignment</GreenButton>,
      name: "Add New Assignment",
      action: () => navigate("/Admin/assignments/add"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Assignments",
      action: () => setShowPopup(true),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {Array.isArray(assignmentRows) && assignmentRows.length > 0 && (
              <TableTemplate
                buttonHaver={AssignmentButtonHaver}
                columns={assignmentColumns}
                rows={assignmentRows}
              />
            )}
            <SpeedDialTemplate actions={actions} />
          </Paper>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ShowAssignments;
