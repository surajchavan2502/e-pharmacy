import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  useTheme,
  Box,
  Avatar,
} from "@mui/material";
import {
  Dashboard,
  LocalPharmacy,
  People,
  Settings,
  ShoppingCart,
  Receipt,
  HelpOutline,
  Logout,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router";

const sidebarWidth = 280;

const AdminSidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const [activePath, setActivePath] = React.useState(window.location.pathname);

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin" },
    { text: "Medicines", icon: <LocalPharmacy />, path: "/admin/medicines" },
    { text: "Users", icon: <People />, path: "/admin/users" },
    { text: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
    { text: "Reports", icon: <Receipt />, path: "/admin/reports" },
  ];

  const bottomMenuItems = [
    { text: "Settings", icon: <Settings />, path: "/admin/settings" },
    { text: "Help", icon: <HelpOutline />, path: "/admin/help" },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      onClose={onClose}
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sidebarWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {/* Logo Section */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80px !important",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            <LocalPharmacy />
          </Avatar>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PharmaAdmin
          </Typography>
        </Box>
      </Toolbar>

      {/* Main Menu */}
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={activePath === item.path}
            onClick={() => setActivePath(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                backgroundColor: `${theme.palette.primary.light}20`,
                "& .MuiListItemIcon-root": {
                  color: theme.palette.primary.main,
                },
                "& .MuiListItemText-primary": {
                  fontWeight: 500,
                },
              },
              "&:hover": {
                backgroundColor: `${theme.palette.primary.light}10`,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {React.cloneElement(item.icon, {
                color: activePath === item.path ? "primary" : "inherit",
              })}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: activePath === item.path ? 500 : 400,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Bottom Menu */}
      <List sx={{ px: 2, mt: "auto" }}>
        {bottomMenuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={activePath === item.path}
            onClick={() => setActivePath(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&:hover": {
                backgroundColor: `${theme.palette.primary.light}10`,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
        <ListItemButton
          sx={{
            borderRadius: 2,
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: `${theme.palette.error.light}10`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
