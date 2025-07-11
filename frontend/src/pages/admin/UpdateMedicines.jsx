/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import API from "../../utils/API";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  FormControlLabel,
  Checkbox,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Avatar,
  useTheme,
  InputAdornment,
  Chip,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  MedicalServices,
  ArrowBack,
  LocalPharmacy,
  AttachMoney,
  Percent,
  Inventory,
  Numbers,
  CalendarToday,
  Check,
} from "@mui/icons-material";

const UpdateMedicines = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState({
    name: "",
    category: "",
    price: "",
    discount: "",
    stock: "",
    expiryDate: "",
    manufacturer: "",
    isPrescriptionRequired: false,
    batchNumber: "",
  });

  const [loading, setLoading] = useState({
    fetch: false,
    update: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categories = [
    { value: "tablet", label: "Tablet" },
    { value: "syrup", label: "Syrup" },
    { value: "capsule", label: "Capsule" },
    { value: "injection", label: "Injection" },
    { value: "ointment", label: "Ointment" },
    { value: "drops", label: "Eye/Ear Drops" },
  ];

  // Fetch medicine details
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading((prev) => ({ ...prev, fetch: true }));
        const response = await API.get(
          `/api/protected/admin/medicines/medicine/${id}`
        );
        setMedicine(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch medicine details. Please try again.");
      } finally {
        setLoading((prev) => ({ ...prev, fetch: false }));
      }
    };
    fetchMedicine();
  }, [id]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update submission
  const handleUpdate = async () => {
    try {
      setLoading((prev) => ({ ...prev, update: true }));
      setError(null);
      await API.put("/api/protected/admin/medicines/update-medicine", {
        medicineId: id,
        ...medicine,
      });
      setSuccess("Medicine updated successfully!");
      setTimeout(() => navigate("/admin/medicines"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update medicine. Please try again."
      );
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  if (loading.fetch) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading medicine details...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Medicines
      </Button>

      <Card sx={{ boxShadow: theme.shadows[3], borderRadius: 2 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <MedicalServices />
            </Avatar>
          }
          title={
            <Typography variant="h5" fontWeight="bold">
              Update Medicine
            </Typography>
          }
          subheader={`Editing medicine ID: ${id}`}
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        />

        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Medicine Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Medicine Name"
                name="name"
                value={medicine.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPharmacy color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={medicine.category}
                onChange={handleChange}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                value={medicine.price}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Discount */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discount"
                name="discount"
                value={medicine.discount}
                onChange={handleChange}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Stock */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                value={medicine.stock}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Expiry Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Expiry Date"
                name="expiryDate"
                value={medicine.expiryDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Manufacturer */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manufacturer"
                name="manufacturer"
                value={medicine.manufacturer}
                onChange={handleChange}
              />
            </Grid>

            {/* Batch Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Batch Number"
                name="batchNumber"
                value={medicine.batchNumber}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Numbers color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Prescription Required */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={medicine.isPrescriptionRequired}
                    onChange={() =>
                      setMedicine((prev) => ({
                        ...prev,
                        isPrescriptionRequired: !prev.isPrescriptionRequired,
                      }))
                    }
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography>Prescription Required</Typography>
                    <Chip
                      label={medicine.isPrescriptionRequired ? "Yes" : "No"}
                      size="small"
                      color={
                        medicine.isPrescriptionRequired ? "primary" : "default"
                      }
                      variant="outlined"
                    />
                  </Box>
                }
              />
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  disabled={loading.update}
                  startIcon={
                    loading.update ? <CircularProgress size={20} /> : <Check />
                  }
                  sx={{ px: 4, py: 1.5 }}
                >
                  {loading.update ? "Updating..." : "Update Medicine"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpdateMedicines;
