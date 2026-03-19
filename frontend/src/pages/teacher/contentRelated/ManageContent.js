import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContents,
  createContent,
  editContent,
  removeContent,
} from "../../../redux/contentRelated/contentHandle";
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

const ManageContent = ({ subjectId, classId }) => {
  const dispatch = useDispatch();
  const { contents, loading, error } = useSelector((state) => state.content);
  const globalLoading = useSelector((state) => state.user.loading);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", file: null });
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchContents({ subjectId, classId }));
  }, [dispatch, subjectId, classId]);

  useEffect(() => {
    if (isSubmitting && !globalLoading && !error) {
      handleClose();
      setIsSubmitting(false);
    }

    if (isSubmitting && !globalLoading && error) {
      setIsSubmitting(false);
    }
  }, [globalLoading, error, isSubmitting]);

  const handleOpen = () => {
    setForm({ title: "", description: "", file: null });
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (content) => {
    setForm({
      title: content.title,
      description: content.description,
      file: null,
    });
    setEditId(content._id);
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
    if (!form.title || globalLoading) {
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    if (form.file) data.append("file", form.file);
    if (subjectId) data.append("subjectId", subjectId);
    if (classId) data.append("classId", classId);
    if (editMode) {
      data.append("_id", editId);
      dispatch(editContent(data));
    } else {
      dispatch(createContent(data));
    }
    setIsSubmitting(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this content?")) {
      dispatch(removeContent(id));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Course Content
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add Content
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
                <TableCell>File</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contents.map((content) => (
                <TableRow key={content._id}>
                  <TableCell>{content.title}</TableCell>
                  <TableCell>{content.description}</TableCell>
                  <TableCell>
                    {content.fileUrl ? (
                      <a
                        href={content.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <UploadFile />
                      </a>
                    ) : (
                      "No file"
                    )}
                  </TableCell>
                  <TableCell>
                    {content.createdAt
                      ? new Date(content.createdAt).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(content)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(content._id)}
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
        <DialogTitle>{editMode ? "Edit Content" : "Add Content"}</DialogTitle>
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
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFile />}
          >
            Upload File
            <input type="file" name="file" hidden onChange={handleChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={globalLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={globalLoading}
          >
            {globalLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : editMode ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageContent;
