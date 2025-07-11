import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  AccountCircle,
  Logout,
  Settings,
} from "@mui/icons-material";

const UserHeader = ({ onMenuClick }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Left: Menu Button and Company Name */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 1, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              display: { xs: "none", sm: "block" },
              color: theme.palette.primary.main,
            }}
          >
            MediCare Pharmacy
          </Typography>
        </Box>

        {/* Center: Search Bar */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 1,
              bgcolor: "action.hover",
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                px: 2,
                color: "text.secondary",
              }}
            >
              <Search />
            </Box>
            <InputBase
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "100%",
                pl: 6,
                py: 1,
              }}
            />
          </Box>
        </Box>

        {/* Right: Icons */}
        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          {/* Notifications */}
          <IconButton onClick={handleNotificationsOpen} sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Settings */}
          <IconButton sx={{ mr: 1 }}>
            <Settings />
          </IconButton>

          {/* Avatar */}
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              U
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              boxShadow: theme.shadows[3],
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <AccountCircle sx={{ mr: 1, color: "text.secondary" }} />
            My Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1, color: theme.palette.error.main }} />
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 320,
              p: 0,
              boxShadow: theme.shadows[3],
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          <Box sx={{ maxHeight: 400, overflow: "auto" }}>
            {/* Notification items go here */}
            <MenuItem onClick={handleNotificationsClose}>
              <Typography variant="body2">No new notifications</Typography>
            </MenuItem>
          </Box>
          <Box
            sx={{
              p: 1,
              borderTop: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 500, cursor: "pointer" }}
            >
              View All
            </Typography>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;
