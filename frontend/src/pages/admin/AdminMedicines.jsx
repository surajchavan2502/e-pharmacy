/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../../utils/API";
import ConfirmDialog from "../../utils/ConfirmDialog";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Pagination,
  Button,
  Box,
  IconButton,
  Tooltip,
  TextField,
  useTheme,
  Skeleton,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Search,
  Inventory,
  LocalPharmacy,
} from "@mui/icons-material";
import { format } from "date-fns";

const AdminMedicines = () => {
  const theme = useTheme();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
  }, [page]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = medicines.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedicines(filtered);
    } else {
      setFilteredMedicines(medicines);
    }
  }, [searchTerm, medicines]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/protected/admin/medicines/getall?page=${page}&limit=${rowsPerPage}`
      );
      setMedicines(response.data.data.medicines);
      setFilteredMedicines(response.data.data.medicines);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError("Failed to fetch medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDelete = async () => {
    if (!selectedMedicine) return;

    setDeleteLoading(selectedMedicine);
    try {
      await API.delete("/api/protected/admin/medicines/delete-medicine", {
        data: { medicineId: selectedMedicine },
      });
      setMedicines(medicines.filter((med) => med._id !== selectedMedicine));
      setFilteredMedicines(
        filteredMedicines.filter((med) => med._id !== selectedMedicine)
      );
    } catch (error) {
      alert("Failed to delete medicine. Try again.");
    } finally {
      setDeleteLoading(null);
      setConfirmOpen(false);
      setSelectedMedicine(null);
    }
  };

  const getStockColor = (stock) => {
    if (stock < 10) return theme.palette.error.main;
    if (stock < 50) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" alignItems="center">
          <LocalPharmacy
            sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }}
          />
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Medicine Inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate("/admin/medicines/create")}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          Add New Medicine
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search medicines..."
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
        <Box display="flex" gap={2}>
          <Chip
            label={`Total: ${medicines.length}`}
            variant="outlined"
            color="primary"
            icon={<Inventory fontSize="small" />}
          />
        </Box>
      </Box>

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
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              "&:hover": {
                boxShadow: theme.shadows[3],
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Price (₹)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Discount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Expiry Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Manufacturer
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Prescription
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Batch No.
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map((medicine) => (
                    <TableRow
                      key={medicine._id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {medicine.name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={medicine.category}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>₹{medicine.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {medicine.discount > 0 ? (
                          <Chip
                            label={`${medicine.discount}%`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          <Typography color="text.secondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: getStockColor(medicine.stock),
                              mr: 1,
                            }}
                          />
                          {medicine.stock}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {format(new Date(medicine.expiryDate), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>{medicine.manufacturer}</TableCell>
                      <TableCell>
                        {medicine.isPrescriptionRequired ? (
                          <Chip label="Required" color="error" size="small" />
                        ) : (
                          <Chip
                            label="Not Required"
                            color="success"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>{medicine.batchNumber}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate(
                                  `/admin/medicines/update/${medicine._id}`
                                )
                              }
                              size="small"
                              sx={{
                                backgroundColor: `${theme.palette.primary.main}10`,
                                "&:hover": {
                                  backgroundColor: `${theme.palette.primary.main}20`,
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => {
                                setSelectedMedicine(medicine._id);
                                setConfirmOpen(true);
                              }}
                              disabled={deleteLoading === medicine._id}
                              size="small"
                              sx={{
                                backgroundColor: `${theme.palette.error.main}10`,
                                "&:hover": {
                                  backgroundColor: `${theme.palette.error.main}20`,
                                },
                              }}
                            >
                              {deleteLoading === medicine._id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Delete fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Inventory
                          sx={{
                            fontSize: 60,
                            color: theme.palette.text.disabled,
                            mb: 2,
                          }}
                        />
                        <Typography variant="h6" color="text.secondary">
                          No medicines found
                        </Typography>
                        {searchTerm && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={1}
                          >
                            No results for "{searchTerm}"
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredMedicines.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={3}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * rowsPerPage + 1} to{" "}
                {Math.min(page * rowsPerPage, filteredMedicines.length)} of{" "}
                {filteredMedicines.length} medicines
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Medicine?"
        message="Are you sure you want to delete this medicine? This action cannot be undone."
        handleClose={() => setConfirmOpen(false)}
        handleConfirm={handleDelete}
      />
    </Container>
  );
};

export default AdminMedicines;
