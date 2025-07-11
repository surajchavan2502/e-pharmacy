/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import API from "../../utils/API";
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Card,
  Avatar,
  Container,
  Divider,
  useTheme,
  InputAdornment,
  CardHeader,
  CardContent,
  Stack,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Home,
  LocationCity,
  Map,
  ArrowBack,
} from "@mui/icons-material";

const UpdateUser = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/protected/admin/admin-user/get-user/${id}`
      );
      const userData = response.data.data;
      setUser({
        fname: userData.fname || "",
        lname: userData.lname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        street: userData.address?.street || "",
        city: userData.address?.city || "",
        state: userData.address?.state || "",
        zip: userData.address?.zip || "",
      });
    } catch (error) {
      toast.error("Failed to fetch user details");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await API.put(`/api/protected/admin/admin-user/update-user/${id}`, user);
      toast.success("User updated successfully");
      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Users
      </Button>

      <Card
        sx={{
          boxShadow: theme.shadows[3],
          borderRadius: 2,
          overflow: "visible",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: theme.palette.primary.main,
                fontSize: "1.5rem",
              }}
            >
              {user.fname.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={
            <Typography variant="h5" fontWeight="bold">
              Update User Profile
            </Typography>
          }
        />

        <CardContent>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="fname"
                value={user.fname}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lname"
                value={user.lname}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={user.email}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Address Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Address Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="street"
                value={user.street}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={user.city}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCity color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={user.state}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Map color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zip"
                value={user.zip}
                onChange={handleChange}
              />
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider sx={{ mb: 3 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/users")}
                  sx={{ px: 4 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : null}
                  sx={{ px: 4 }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpdateUser;
