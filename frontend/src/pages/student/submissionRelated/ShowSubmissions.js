import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubmissions,
  createSubmission,
  editSubmission,
  removeSubmission,
} from "../../../redux/submissionRelated/submissionHandle";
import {
  Button,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, UploadFile } from "@mui/icons-material";

const ShowSubmissions = ({ assignmentId, quizId }) => {
  const dispatch = useDispatch();
  const { submissions, loading, error } = useSelector(
    (state) => state.submission,
  );
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ file: null, comment: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchSubmissions({ assignmentId, quizId }));
  }, [dispatch, assignmentId, quizId]);

  const handleOpen = () => {
    setForm({ file: null, comment: "" });
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (submission) => {
    setForm({ file: null, comment: submission.comment });
    setEditId(submission._id);
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = () => {
    const data = new FormData();
    if (form.file) data.append("file", form.file);
    data.append("comment", form.comment);
    if (assignmentId) data.append("assignmentId", assignmentId);
    if (currentUser?._id) data.append("student", currentUser._id);
    if (editMode) {
      data.append("_id", editId);
      dispatch(editSubmission(data));
    } else {
      dispatch(createSubmission(data));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this submission?")) {
      dispatch(removeSubmission(id));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Submissions
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Submit Assignment/Quiz
      </Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>
                    {submission.fileUrl ? (
                      <a
                        href={submission.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <UploadFile />
                      </a>
                    ) : (
                      "No file"
                    )}
                  </TableCell>
                  <TableCell>{submission.comment}</TableCell>
                  <TableCell>
                    {submission.submittedAt || submission.createdAt
                      ? new Date(
                          submission.submittedAt || submission.createdAt,
                        ).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(submission)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(submission._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editMode ? "Edit Submission" : "Submit Assignment/Quiz"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 350,
          }}
        >
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFile />}
          >
            Upload File
            <input type="file" name="file" hidden onChange={handleChange} />
          </Button>
          <TextField
            label="Comment"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            fullWidth
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShowSubmissions;
