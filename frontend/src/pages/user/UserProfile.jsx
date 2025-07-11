import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Cake,
  Person,
  AccountBalanceWallet,
  VerifiedUser,
  Edit,
  MedicalInformation,
  LocalPharmacy,
  ShoppingCart,
  Notifications,
} from "@mui/icons-material";
import API from "../../utils/API";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef(null);
  const theme = useTheme();

  const getAvatarUrl = (avatarFilename) => {
    if (!avatarFilename) return "/default-avatar.png";
    return `/api/user/avatars/${avatarFilename}`;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        "/api/protected/admin/user/profile/profile"
      );
      const profileData = response.data.data;

      setUser(profileData);
      setUnreadNotifications(
        profileData.notifications?.filter((n) => !n.read).length || 0
      );
    } catch (err) {
      console.error(
        "Error fetching user profile:",
        err?.response?.data || err.message
      );
      setSnackbar({
        open: true,
        message: "Failed to load user profile",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSnackbar({
        open: true,
        message: "Please upload an image file (JPEG, PNG, etc.)",
        severity: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "Image size should be less than 5MB",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setAvatarLoading(true);
      const response = await API.post(
        "/api/protected/admin/user/profile/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        avatar: response.data.data.avatar,
      }));

      setSnackbar({
        open: true,
        message: "Profile picture updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Failed to update profile picture",
        severity: "error",
      });
    } finally {
      setAvatarLoading(false);
      event.target.value = "";
    }
  };

  const handleEditAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading && !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" pt={10}>
        <Typography variant="h6" color="error">
          Failed to load user profile. Please try again later.
        </Typography>
        <Button variant="contained" onClick={fetchProfile} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            mb: 3,
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                size="small"
                color="primary"
                onClick={handleEditAvatarClick}
                disabled={avatarLoading}
                sx={{
                  bgcolor: theme.palette.background.paper,
                  boxShadow: theme.shadows[2],
                  "&:hover": {
                    bgcolor: theme.palette.background.paper,
                  },
                }}
              >
                {avatarLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Edit fontSize="small" />
                )}
              </IconButton>
            }
          >
            {avatarLoading ? (
              <CircularProgress size={100} />
            ) : (
              <Avatar
                src={getAvatarUrl(user.avatar)}
                alt={`${user.fname} ${user.lname}`}
                sx={{
                  width: 120,
                  height: 120,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 },
                  border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
                onClick={handleEditAvatarClick}
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            )}
          </Badge>

          <Box sx={{ ml: { xs: 0, md: 3 }, mt: { xs: 2, md: 0 } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h4" fontWeight="bold">
                {user.fname} {user.lname}
              </Typography>
              <Chip
                label={user.role.toUpperCase()}
                color={user.role === "admin" ? "secondary" : "primary"}
                size="small"
                sx={{
                  height: 24,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              />
            </Stack>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {user.email}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
            >
              <Chip
                icon={<VerifiedUser fontSize="small" />}
                label={user.isVerified ? "Verified" : "Not Verified"}
                color={user.isVerified ? "success" : "warning"}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<AccountBalanceWallet fontSize="small" />}
                label={`₹${user.walletBalance || 0}`}
                color="info"
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 2,
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 2,
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="Overview"
            icon={<Person fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            label="Medical History"
            icon={<MedicalInformation fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            label="Prescriptions"
            icon={<LocalPharmacy fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            label="Orders"
            icon={<ShoppingCart fontSize="small" />}
            iconPosition="start"
          />
          <Tab
            label={
              <Badge badgeContent={unreadNotifications} color="error">
                Notifications
              </Badge>
            }
            icon={<Notifications fontSize="small" />}
            iconPosition="start"
          />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{ borderRadius: 3, bgcolor: "transparent" }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Person sx={{ mr: 1, color: "primary.main" }} />
                    Personal Information
                  </Typography>
                  <List disablePadding>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={user.email}
                        secondaryTypographyProps={{ color: "text.primary" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={user.phone || "Not provided"}
                        secondaryTypographyProps={{ color: "text.primary" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Cake color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Date of Birth"
                        secondary={
                          user.dateOfBirth
                            ? new Date(user.dateOfBirth).toLocaleDateString()
                            : "Not specified"
                        }
                        secondaryTypographyProps={{ color: "text.primary" }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Person color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Gender"
                        secondary={
                          user.gender
                            ? user.gender.charAt(0).toUpperCase() +
                              user.gender.slice(1)
                            : "Not specified"
                        }
                        secondaryTypographyProps={{ color: "text.primary" }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{ borderRadius: 3, bgcolor: "transparent" }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                    Contact Information
                  </Typography>
                  <List disablePadding>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LocationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={
                          user.address?.street ? (
                            <>
                              {user.address.street}
                              <br />
                              {user.address.city}, {user.address.state} -{" "}
                              {user.address.zip}
                            </>
                          ) : (
                            "Not provided"
                          )
                        }
                        secondaryTypographyProps={{ color: "text.primary" }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <Typography color="text.secondary">
              Medical history will be displayed here
            </Typography>
          </Box>
        )}

        {activeTab === 2 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <Typography color="text.secondary">
              Prescriptions will be displayed here
            </Typography>
          </Box>
        )}

        {activeTab === 3 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <Typography color="text.secondary">
              Orders will be displayed here
            </Typography>
          </Box>
        )}

        {activeTab === 4 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <Typography color="text.secondary">
              Notifications will be displayed here
            </Typography>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
