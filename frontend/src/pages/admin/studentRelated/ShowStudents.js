import { useEffect, useState } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconButton, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popper from "@mui/material/Popper";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import {
  BlackButton,
  BlueButton,
  GreenButton,
} from "../../../components/buttonStyles";
import EmptyState from "../../../components/EmptyState";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import TableSkeleton from "../../../components/TableSkeleton";
import TableTemplate from "../../../components/TableTemplate";

const studentColumns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "rollNum", label: "Roll Number", minWidth: 100 },
];

const ShowStudents = ({ showNotification }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList, loading, error, response, pagination } = useSelector(
    (state) => state.student,
  );
  const { currentUser } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(
      getAllStudents(currentUser._id, {
        page: page + 1,
        limit: rowsPerPage,
        search: searchValue,
      }),
    );
  }, [currentUser._id, dispatch, page, rowsPerPage, searchValue]);

  if (error) {
    console.log(error);
  }

  const deleteHandler = () => {
    showNotification?.(
      "Sorry, the delete function has been disabled for now.",
      "warning",
    );
  };

  const StudentButtonHaver = ({ row }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const options = ["Attendance", "Marks"];

    const handleClick = () => {
      if (selectedIndex === 0) {
        navigate(`/Admin/students/student/attendance/${row.id}`);
      } else {
        navigate(`/Admin/students/student/marks/${row.id}`);
      }
    };

    const handleMenuItemClick = (_event, index) => {
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
        <IconButton onClick={() => deleteHandler(row.id, "Student")}>
          <PersonRemoveIcon color="error" />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate(`/Admin/students/student/${row.id}`)}
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
              aria-label="select action"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </BlackButton>
          </ButtonGroup>
          <Popper
            sx={{ zIndex: 1 }}
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

  const studentRows = Array.isArray(studentsList)
    ? studentsList.map((student) => ({
        id: student._id,
        name: student.name,
        rollNum: student.rollNum,
      }))
    : [];

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Add New Student",
      action: () => navigate("/Admin/addstudents"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Delete All Students",
      action: () => deleteHandler(currentUser._id, "Students"),
    },
  ];

  if (loading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableSkeleton columns={studentColumns} rows={rowsPerPage} showSearch />
      </Paper>
    );
  }

  if (response) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        <EmptyState
          icon={<SchoolRoundedIcon />}
          title="No students yet"
          description="Start building the class roster by adding your first student record."
          action={
            <GreenButton
              variant="contained"
              onClick={() => navigate("/Admin/addstudents")}
              aria-label="Add Students"
            >
              Add Students
            </GreenButton>
          }
        />
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableTemplate
        buttonHaver={StudentButtonHaver}
        columns={studentColumns}
        rows={studentRows}
        serverSide
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={pagination.total}
        onPageChange={(_event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(_event, newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
          setPage(0);
        }}
        searchPlaceholder="Search by student name or roll number"
        emptyMessage="No students match the current search."
        emptyStateProps={
          searchValue
            ? {
                icon: <SearchOffRoundedIcon />,
                title: "No matching students",
                description:
                  "Try a different name or roll number to find the student you need.",
              }
            : {
                icon: <SchoolRoundedIcon />,
                title: "No students available",
                description:
                  "Students will appear here after they are added to the system.",
              }
        }
      />
      <SpeedDialTemplate actions={actions} />
    </Paper>
  );
};

export default ShowStudents;
