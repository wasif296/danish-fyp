import React, { useMemo, useState } from "react";
import {
  Box,
  InputAdornment,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EmptyState from "./EmptyState";
import { StyledTableCell, StyledTableRow } from "./styles";

const TableTemplate = ({
  buttonHaver: ButtonHaver,
  columns,
  rows,
  page: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
  serverSide = false,
  emptyMessage = "No records found.",
  emptyStateProps,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const resolvedPage = serverSide ? (controlledPage ?? 0) : page;
  const resolvedRowsPerPage = serverSide
    ? (controlledRowsPerPage ?? 5)
    : rowsPerPage;

  const visibleRows = useMemo(() => {
    if (serverSide) {
      return rows;
    }

    return rows.slice(
      resolvedPage * resolvedRowsPerPage,
      resolvedPage * resolvedRowsPerPage + resolvedRowsPerPage,
    );
  }, [rows, serverSide, resolvedPage, resolvedRowsPerPage]);

  const paginationCount = serverSide
    ? (totalCount ?? rows.length)
    : rows.length;

  const handlePageChange = (event, newPage) => {
    if (serverSide) {
      onPageChange?.(event, newPage);
      return;
    }

    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);

    if (serverSide) {
      onRowsPerPageChange?.(event, newRowsPerPage);
      return;
    }

    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <>
      {(onSearchChange || searchValue) && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            size="small"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            sx={{ minWidth: { xs: "100%", sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <StyledTableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => {
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <StyledTableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </StyledTableCell>
                      );
                    })}
                    <StyledTableCell align="center">
                      <ButtonHaver row={row} />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={columns.length + 1} align="center">
                  {emptyStateProps ? (
                    <EmptyState
                      compact
                      minHeight={190}
                      description={emptyMessage}
                      {...emptyStateProps}
                    />
                  ) : (
                    <Typography variant="body2">{emptyMessage}</Typography>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={paginationCount}
        rowsPerPage={resolvedRowsPerPage}
        page={resolvedPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
};

export default TableTemplate;
