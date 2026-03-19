import React from "react";
import {
  Box,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { StyledTableCell, StyledTableRow } from "./styles";

const TableSkeleton = ({
  columns = [],
  rows = 5,
  showSearch = true,
  showActions = true,
}) => {
  const skeletonRows = Array.from({ length: rows });

  return (
    <>
      {showSearch && (
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
            disabled
            placeholder="Search"
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
        <Table stickyHeader aria-label="table skeleton">
          <TableHead>
            <StyledTableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <Skeleton variant="text" width="70%" />
                </StyledTableCell>
              ))}
              {showActions && (
                <StyledTableCell align="center">
                  <Skeleton variant="text" width={70} sx={{ mx: "auto" }} />
                </StyledTableCell>
              )}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {skeletonRows.map((_, index) => (
              <StyledTableRow key={index}>
                {columns.map((column) => (
                  <StyledTableCell key={column.id} align={column.align}>
                    <Skeleton
                      variant="text"
                      width={`${55 + (((index + 1) % 3) + 1) * 10}%`}
                    />
                  </StyledTableCell>
                ))}
                {showActions && (
                  <StyledTableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Skeleton variant="rounded" width={36} height={36} />
                      <Skeleton variant="rounded" width={72} height={36} />
                      <Skeleton variant="rounded" width={92} height={36} />
                    </Box>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={0}
        rowsPerPage={rows}
        page={0}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </>
  );
};

export default TableSkeleton;
