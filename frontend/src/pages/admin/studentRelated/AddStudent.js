import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
// import Popup from '../../../components/Popup';
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { CircularProgress } from "@mui/material";

const AddStudent = ({ situation, showNotification }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector((state) => state.sclass);

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [sclassName, setSclassName] = useState("");

  const adminID = currentUser._id;
  const role = "Student";
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

  // const [showPopup, setShowPopup] = useState(false);
  // const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const changeHandler = (event) => {
    if (event.target.value === "Select Class") {
      setClassName("Select Class");
      setSclassName("");
    } else {
      const selectedClass = sclassesList.find(
        (classItem) => classItem.sclassName === event.target.value,
      );
      setClassName(selectedClass.sclassName);
      setSclassName(selectedClass._id);
    }
  };

  const fields = {
    name,
    rollNum,
    password,
    sclassName,
    adminID,
    role,
    attendance,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (sclassName === "") {
      showNotification &&
        showNotification("Please select a classname", "warning");
    } else {
      setLoader(true);
      dispatch(registerUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      showNotification &&
        showNotification("Student added successfully!", "success");
      navigate(-1);
    } else if (status === "failed") {
      showNotification &&
        showNotification(response || "Failed to add student", "error");
      setLoader(false);
    } else if (status === "error") {
      showNotification && showNotification("Network Error", "error");
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch, showNotification]);

  return (
    <div className="register">
      <form
        className="registerForm"
        onSubmit={submitHandler}
        aria-label="Add Student Form"
      >
        <span className="registerTitle">Add Student</span>
        <label htmlFor="student-name">Name</label>
        <input
          id="student-name"
          className="registerInput"
          type="text"
          placeholder="Enter student's name..."
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
          aria-required="true"
        />

        {situation === "Student" && (
          <>
            <label htmlFor="student-class">Class</label>
            <select
              id="student-class"
              className="registerInput"
              value={className}
              onChange={changeHandler}
              required
              aria-required="true"
            >
              <option value="Select Class">Select Class</option>
              {sclassesList.map((classItem, index) => (
                <option key={index} value={classItem.sclassName}>
                  {classItem.sclassName}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="student-roll">Roll Number</label>
        <input
          id="student-roll"
          className="registerInput"
          type="number"
          placeholder="Enter student's Roll Number..."
          value={rollNum}
          onChange={(event) => setRollNum(event.target.value)}
          required
          aria-required="true"
        />

        <label htmlFor="student-password">Password</label>
        <input
          id="student-password"
          className="registerInput"
          type="password"
          placeholder="Enter student's password..."
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required
          aria-required="true"
        />

        <button
          className="registerButton"
          type="submit"
          disabled={loader}
          aria-busy={loader}
          aria-label="Add Student"
        >
          {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
