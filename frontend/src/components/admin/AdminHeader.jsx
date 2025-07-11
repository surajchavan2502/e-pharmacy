import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  Badge,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Logout,
  AccountCircle,
  Search,
  Menu as MenuIcon,
  Notifications,
  Settings,
  HelpOutline,
} from "@mui/icons-material";

const AdminHeader = ({ handleDrawerToggle }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: "100%", md: `calc(100% - ${theme.spacing(35)})` },
        ml: { md: theme.spacing(30) },
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 3 },
          minHeight: "64px",
        }}
      >
        {/* Left Section - Menu Icon & Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
            }}
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

        {/* Middle Section - Search Bar */}
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: 600,
            mx: { xs: 0, md: 4 },
            display: { xs: "none", md: "block" },
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: theme.palette.action.hover,
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right Section - Icons & User Menu */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Mobile Search Button */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Search />
          </IconButton>

          {/* Notification Icon */}
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Settings Icon */}
          <IconButton color="inherit">
            <Settings />
          </IconButton>

          {/* Help Icon */}
          <IconButton color="inherit">
            <HelpOutline />
          </IconButton>

          {/* User Avatar and Dropdown */}
          <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              A
            </Avatar>
          </IconButton>

          {/* User Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
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
              <AccountCircle sx={{ mr: 1.5 }} fontSize="small" />
              My Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 1.5 }} fontSize="small" />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout
                sx={{ mr: 1.5, color: theme.palette.error.main }}
                fontSize="small"
              />
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
