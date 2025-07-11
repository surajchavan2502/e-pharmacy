/* eslint-disable no-unused-vars */
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
  Box,
  useTheme,
  styled,
} from "@mui/material";
import {
  Home,
  LocalPharmacy,
  ShoppingCart,
  History,
  Person,
  Settings,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router";

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    background: theme.palette.background.paper,
    borderRight: "none",
    boxShadow: "0 0 20px rgba(0,0,0,0.05)",
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 15,
  fontSize: "1.5rem",
  letterSpacing: 1,
  background: theme.palette.primary.main,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  "&.active": {
    backgroundColor: theme.palette.action.selected,
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiListItemText-primary": {
      fontWeight: 600,
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserSidebar = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const location = useLocation(); // <<=== important
  const currentPath = location.pathname;

  const routes = [
    { icon: <Home />, text: "Dashboard", path: "/user" },
    { icon: <LocalPharmacy />, text: "Medicines", path: "/user/medicines" },
    { icon: <ShoppingCart />, text: "Cart", path: "/user/cart" },
    { icon: <History />, text: "History", path: "/user/history" },
    { divider: true },
    { icon: <Person />, text: "Profile", path: "/user/profile" },
    { icon: <Settings />, text: "Settings", path: "/user/settings" },
  ];

  return (
    <StyledDrawer
      variant={mobileOpen ? "temporary" : "permanent"}
      open={mobileOpen}
      onClose={onClose}
    >
      <Toolbar />
      <LogoContainer>
        <LogoText variant="h5">User Dashboard</LogoText>
      </LogoContainer>

      <Divider sx={{ mx: 2 }} />

      <List sx={{ p: 1 }}>
        {routes.map((item, index) =>
          item.divider ? (
            <Divider key={index} sx={{ my: 1 }} />
          ) : (
            <StyledListItem
              key={item.text}
              component={Link}
              to={item.path}
              onClick={onClose}
              className={currentPath === item.path ? "active" : ""}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          )
        )}
      </List>
    </StyledDrawer>
  );
};

export default UserSidebar;
