/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Avatar,
  Chip,
  TextField,
  useTheme,
  Skeleton,
  Card,
  CardHeader,
  Divider,
  Badge,
} from "@mui/material";
import {
  Delete,
  ShoppingCart,
  Edit,
  Search,
  Person,
  Add,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import API from "../../utils/API";
import { deepPurple } from "@mui/material/colors";

const AdminUser = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          `${user.fname || ""} ${user.lname || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        `/api/protected/admin/admin-user/getall-user?page=${
          page + 1
        }&limit=${rowsPerPage}`
      );
      const data = response?.data?.data || {};
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (userId) => {
    setUserIdToDelete(userId);
    setOpenDeleteDialog(true);
  };

  const deleteUser = async () => {
    try {
      await API.delete(
        `/api/protected/admin/admin-user/delete-user/${userIdToDelete}`
      );
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setOpenDeleteDialog(false);
      setUserIdToDelete(null);
    }
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const stringAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((part) => part[0])
      .join("");
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 36,
        height: 36,
        fontSize: "0.875rem",
      },
      children: initials,
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3, boxShadow: theme.shadows[2] }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <Person sx={{ fontSize: 32, mr: 2, color: deepPurple[500] }} />
              <Typography variant="h5" fontWeight="bold">
                User Management
              </Typography>
            </Box>
          }
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate("/admin/users/create")}
              sx={{
                borderRadius: 2,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              Add User
            </Button>
          }
        />
        <Divider />
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search users..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "action.active", mr: 1 }} />,
              sx: {
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                width: 350,
              },
            }}
          />
          <Chip
            label={`Total: ${users.length} users`}
            color="primary"
            variant="outlined"
            icon={<Person fontSize="small" />}
          />
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ width: "100%" }}>
          {[...Array(5)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={60}
              sx={{ mb: 2, borderRadius: 2 }}
            />
          ))}
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 6,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
          }}
        >
          <Person
            sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? "No matching users found" : "No users available"}
          </Typography>
          {searchTerm && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              No results for "{searchTerm}"
            </Typography>
          )}
        </Box>
      ) : (
        <Card sx={{ boxShadow: theme.shadows[1] }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    No
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    User
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Cart
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user._id || index}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          {...stringAvatar(
                            `${user.fname || ""} ${user.lname || ""}`
                          )}
                        />
                        <Box ml={2}>
                          <Typography fontWeight={500}>
                            {`${user.fname?.trim() || ""} ${
                              user.lname?.trim() || ""
                            }`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.role || "User"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>{user.email?.trim() || "N/A"}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.phone?.trim() || "No phone"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Cart">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/admin/users/cart?userId=${user._id}`)
                          }
                          sx={{
                            backgroundColor: `${theme.palette.primary.main}10`,
                            "&:hover": {
                              backgroundColor: `${theme.palette.primary.main}20`,
                            },
                          }}
                        >
                          <Badge
                            badgeContent={user.cartItems?.length || 0}
                            color="error"
                          >
                            <ShoppingCart fontSize="small" />
                          </Badge>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Edit User">
                          <IconButton
                            color="secondary"
                            onClick={() =>
                              navigate(`/admin/users/update/${user._id}`)
                            }
                            sx={{
                              backgroundColor: `${theme.palette.secondary.main}10`,
                              "&:hover": {
                                backgroundColor: `${theme.palette.secondary.main}20`,
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            color="error"
                            onClick={() => openDeleteConfirmation(user._id)}
                            sx={{
                              backgroundColor: `${theme.palette.error.main}10`,
                              "&:hover": {
                                backgroundColor: `${theme.palette.error.main}20`,
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              "& .MuiTablePagination-toolbar": {
                padding: 2,
              },
            }}
          />
        </Card>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: "100%",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={deleteUser}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUser;
