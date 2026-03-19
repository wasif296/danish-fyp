import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDepartments } from "../../../redux/departmentRelated/departmentHandle";
import { Paper, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowDepartments = ({ showNotification }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { departments, loading, error } = useSelector(
    (state) => state.department,
  );

  useEffect(() => {
    dispatch(fetchDepartments());
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

  const departmentColumns = [
    { id: "name", label: "Department Name", minWidth: 170 },
    { id: "description", label: "Description", minWidth: 170 },
  ];

  const departmentRows =
    departments && departments.length > 0
      ? departments.map((dept) => ({
          name: dept.name,
          description: dept.description,
          id: dept._id,
        }))
      : [];

  const DepartmentButtonHaver = ({ row }) => (
    <>
      <IconButton onClick={() => deleteHandler(row.id)}>
        <DeleteIcon color="error" />
      </IconButton>
      <BlueButton
        variant="contained"
        onClick={() => navigate(`/Admin/departments/department/${row.id}`)}
      >
        View
      </BlueButton>
    </>
  );

  const actions = [
    {
      icon: <GreenButton variant="contained">Add Department</GreenButton>,
      name: "Add New Department",
      action: () => navigate("/Admin/departments/add"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Departments",
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
            {Array.isArray(departmentRows) && departmentRows.length > 0 && (
              <TableTemplate
                buttonHaver={DepartmentButtonHaver}
                columns={departmentColumns}
                rows={departmentRows}
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

export default ShowDepartments;
