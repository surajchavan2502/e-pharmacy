import React, { useState } from "react";
import { useNavigate } from "react-router";
import API from "../../utils/API";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Avatar,
  useTheme,
  InputAdornment,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import {
  MedicalServices,
  LocalPharmacy,
  ArrowBack,
  Add,
  Close,
  AttachMoney,
  Inventory,
  CalendarToday,
  Numbers,
  Sell,
} from "@mui/icons-material";

const CreateMedicine = () => {
  const theme = useTheme();
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
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    {
      value: "tablet",
      label: "Tablet",
      icon: <LocalPharmacy fontSize="small" />,
    },
    {
      value: "syrup",
      label: "Syrup",
      icon: <MedicalServices fontSize="small" />,
    },
    {
      value: "capsule",
      label: "Capsule",
      icon: <MedicalServices fontSize="small" />,
    },
    {
      value: "injection",
      label: "Injection",
      icon: <MedicalServices fontSize="small" />,
    },
    {
      value: "ointment",
      label: "Ointment",
      icon: <MedicalServices fontSize="small" />,
    },
    {
      value: "drops",
      label: "Eye/Ear Drops",
      icon: <MedicalServices fontSize="small" />,
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!medicine.name.trim()) newErrors.name = "Medicine name is required";
    if (!medicine.category) newErrors.category = "Category is required";
    if (!medicine.price || medicine.price <= 0)
      newErrors.price = "Valid price is required";
    if (medicine.discount < 0 || medicine.discount > 100)
      newErrors.discount = "Discount must be 0-100%";
    if (!medicine.stock || medicine.stock < 0)
      newErrors.stock = "Valid stock quantity is required";
    if (!medicine.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!medicine.manufacturer.trim())
      newErrors.manufacturer = "Manufacturer is required";
    if (!medicine.batchNumber.trim())
      newErrors.batchNumber = "Batch number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicine({ ...medicine, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSwitch = (e) => {
    setMedicine({ ...medicine, isPrescriptionRequired: e.target.checked });
  };

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim() !== "") {
      if (!medicine.tags.includes(tagInput.trim())) {
        setMedicine({ ...medicine, tags: [...medicine.tags, tagInput.trim()] });
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setMedicine({
      ...medicine,
      tags: medicine.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await API.post(
        "/api/protected/admin/medicines/create-medicine",
        medicine
      );
      navigate("/admin/medicines", {
        state: { success: "Medicine created successfully!" },
      });
    } catch (error) {
      console.error("Error creating medicine:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Add New Medicine
            </Typography>
          }
          subheader="Fill in the details to add a new medicine to your inventory"
          sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
        />

        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Medicine Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medicine Name *"
                  name="name"
                  value={medicine.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
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
                  label="Category *"
                  name="category"
                  value={medicine.category}
                  onChange={handleChange}
                  error={!!errors.category}
                  helperText={errors.category}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Price */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (₹) *"
                  type="number"
                  name="price"
                  value={medicine.price}
                  onChange={handleChange}
                  error={!!errors.price}
                  helperText={errors.price}
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
                  label="Discount (%)"
                  type="number"
                  name="discount"
                  value={medicine.discount}
                  onChange={handleChange}
                  error={!!errors.discount}
                  helperText={errors.discount}
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
                  label="Stock Quantity *"
                  type="number"
                  name="stock"
                  value={medicine.stock}
                  onChange={handleChange}
                  error={!!errors.stock}
                  helperText={errors.stock}
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
                  label="Expiry Date *"
                  name="expiryDate"
                  value={medicine.expiryDate}
                  onChange={handleChange}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
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
                  label="Manufacturer *"
                  name="manufacturer"
                  value={medicine.manufacturer}
                  onChange={handleChange}
                  error={!!errors.manufacturer}
                  helperText={errors.manufacturer}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Sell color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Batch Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Batch Number *"
                  name="batchNumber"
                  value={medicine.batchNumber}
                  onChange={handleChange}
                  error={!!errors.batchNumber}
                  helperText={errors.batchNumber}
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
                    <Switch
                      checked={medicine.isPrescriptionRequired}
                      onChange={handleSwitch}
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
                          medicine.isPrescriptionRequired
                            ? "primary"
                            : "default"
                        }
                        variant="outlined"
                      />
                    </Box>
                  }
                />
              </Grid>

              {/* Tags */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags (Press Enter or comma to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={addTag}
                  helperText="Add tags to help categorize this medicine (e.g. 'pain relief', 'fever')"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Add color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {medicine.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      deleteIcon={<Close fontSize="small" />}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Form Actions */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {isSubmitting ? "Creating..." : "Create Medicine"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateMedicine;
