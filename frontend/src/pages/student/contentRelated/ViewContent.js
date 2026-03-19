import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContents } from "../../../redux/contentRelated/contentHandle";
import {
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";

const ViewContent = ({ subjectId, classId }) => {
  const dispatch = useDispatch();
  const { contents, loading, error } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContents({ subjectId, classId }));
  }, [dispatch, subjectId, classId]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Course Content
      </Typography>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ViewContent;
