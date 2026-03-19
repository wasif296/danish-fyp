import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTimetables } from "../../../redux/timetableRelated/timetableHandle";
import { Paper, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowTimetables = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { timetables, loading, error } = useSelector(
    (state) => state.timetable,
  );

  useEffect(() => {
    dispatch(fetchTimetables());
  }, [dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const timetableColumns = [
    { id: "class", label: "Class", minWidth: 170 },
    { id: "day", label: "Day", minWidth: 100 },
    { id: "periods", label: "Periods", minWidth: 200 },
  ];

  const timetableRows =
    timetables && timetables.length > 0
      ? timetables.map((tt) => ({
          class: tt.sclass?.sclassName || "N/A",
          day: tt.day,
          periods: Array.isArray(tt.periods) ? tt.periods.join(", ") : "",
          id: tt._id,
        }))
      : [];

  const TimetableButtonHaver = ({ row }) => (
    <>
      <IconButton onClick={() => deleteHandler(row.id)}>
        <DeleteIcon color="error" />
      </IconButton>
      <BlueButton
        variant="contained"
        onClick={() => navigate(`/Admin/timetables/timetable/${row.id}`)}
      >
        View
      </BlueButton>
    </>
  );

  const actions = [
    {
      icon: <GreenButton variant="contained">Add Timetable</GreenButton>,
      name: "Add New Timetable",
      action: () => navigate("/Admin/timetables/add"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Timetables",
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
            {Array.isArray(timetableRows) && timetableRows.length > 0 && (
              <TableTemplate
                buttonHaver={TimetableButtonHaver}
                columns={timetableColumns}
                rows={timetableRows}
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

export default ShowTimetables;
