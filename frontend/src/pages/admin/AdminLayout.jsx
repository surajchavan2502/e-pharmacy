// import React, { useState } from "react";
// import { Box } from "@mui/material";
// import { Outlet } from "react-router"; // Import Outlet for nested routing
// import AdminHeader from "../../components/admin/AdminHeader";
// import AdminSidebar from "../../components/admin/AdminSidebar";

// const AdminLayout = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Toggle Sidebar on Mobile
//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Sidebar */}
//       <AdminSidebar handleDrawerToggle={handleDrawerToggle} />

//       <Box sx={{ flexGrow: 1, ml: { xs: 0, md: "10px" }, mt: 6, p: 3 }}>
//         {/* Header */}
//         <AdminHeader handleDrawerToggle={handleDrawerToggle} />

//         {/* This will display the nested components like AdminUser */}
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default AdminLayout;
import React, { useState } from "react";
import { Box, useTheme, styled } from "@mui/material";
import { Outlet } from "react-router";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: { xs: 0, md: theme.spacing(30) },
  marginTop: "64px",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
    padding: theme.spacing(2),
  },
}));

const AdminLayout = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <AdminSidebar open={!mobileOpen} onClose={handleDrawerToggle} />

      {/* Main Content Area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          width: { md: `calc(100% - ${theme.spacing(30)})` },
        }}
      >
        {/* Header */}
        <AdminHeader handleDrawerToggle={handleDrawerToggle} />

        {/* Main Content */}
        <MainContent component="main">
          <Outlet />
        </MainContent>
      </Box>
    </Box>
  );
};

export default AdminLayout;
