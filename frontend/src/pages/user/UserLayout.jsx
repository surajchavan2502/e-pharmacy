import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";
import UserHeader from "../../components/user/UserHeader";
import UserSidebar from "../../components/user/UserSidebar";

const UserLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "white" }}>
      <CssBaseline />
      <UserHeader onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <UserSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          pt: { xs: 8, sm: 10 },
          ml: { sm: "10px" },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;
