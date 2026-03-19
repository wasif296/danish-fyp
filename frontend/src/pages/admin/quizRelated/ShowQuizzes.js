import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuizzes,
  createQuiz,
  editQuiz,
  removeQuiz,
} from "../../../redux/quizRelated/quizHandle";
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
import { Add, Edit, Delete } from "@mui/icons-material";

const ShowQuizzes = () => {
  const dispatch = useDispatch();
  const { quizzes, loading, error } = useSelector((state) => state.quiz);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    totalMarks: "",
    dueDate: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleOpen = () => {
    setForm({ title: "", description: "", totalMarks: "", dueDate: "" });
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (quiz) => {
    setForm({
      title: quiz.title,
      description: quiz.description,
      totalMarks: quiz.totalMarks,
      dueDate: quiz.dueDate ? quiz.dueDate.slice(0, 16) : "",
    });
    setEditId(quiz._id);
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editMode) {
      dispatch(editQuiz({ ...form, _id: editId }));
    } else {
      dispatch(createQuiz(form));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this quiz?")) {
      dispatch(removeQuiz(id));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quiz Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add Quiz
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
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Total Marks</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz._id}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.description}</TableCell>
                  <TableCell>{quiz.totalMarks}</TableCell>
                  <TableCell>
                    {quiz.dueDate
                      ? new Date(quiz.dueDate).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(quiz)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(quiz._id)}
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
        <DialogTitle>{editMode ? "Edit Quiz" : "Add Quiz"}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 350,
          }}
        >
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
          />
          <TextField
            label="Total Marks"
            name="totalMarks"
            value={form.totalMarks}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
          <TextField
            label="Due Date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            type="datetime-local"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ShowQuizzes;
