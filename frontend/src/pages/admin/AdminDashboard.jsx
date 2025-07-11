import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from "@mui/material";
import {
  ShoppingCart,
  Inventory,
  TrendingUp,
  People,
  LocalHospital,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import API from "../../utils/API";

const AdminDashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalSales: 0,
    ordersBreakdown: {},
    topSellingMedicines: [],
    lowStockMedicines: [],
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(
        "/api/protected/admin/medicines/dashboard"
      );
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const orderData = Object.entries(stats.ordersBreakdown).map(
    ([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    })
  );

  const topSellingData = stats.topSellingMedicines.map((medicine) => ({
    name:
      medicine.name.length > 15
        ? `${medicine.name.substring(0, 12)}...`
        : medicine.name,
    sales: medicine.totalSold,
  }));

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.error.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.secondary.main,
  ];

  const StatCard = ({ icon, title, value, color }) => (
    <Card
      sx={{
        height: "100%",
        boxShadow: theme.shadows[4],
        borderLeft: `4px solid ${color}`,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            mr: 2,
            p: 2,
            borderRadius: "50%",
            backgroundColor: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, {
            sx: {
              fontSize: 30,
              color: color,
            },
          })}
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

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
        <Typography variant="h6">Loading dashboard data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUp />}
            title="Total Sales"
            value={`₹${stats.totalSales.toLocaleString()}`}
            color={theme.palette.primary.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People />}
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            color={theme.palette.success.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ShoppingCart />}
            title="Total Orders"
            value={Object.values(stats.ordersBreakdown)
              .reduce((a, b) => a + b, 0)
              .toLocaleString()}
            color={theme.palette.error.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Inventory />}
            title="Low Stock"
            value={`${stats.lowStockMedicines.length} Items`}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        {/* Orders Breakdown Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", boxShadow: theme.shadows[2] }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Orders Breakdown
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {orderData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Orders"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Selling Medicines Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", boxShadow: theme.shadows[2] }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Top Selling Medicines
              </Typography>
              <Box sx={{ height: 300 }}>
                {topSellingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topSellingData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, "Units Sold"]} />
                      <Legend />
                      <Bar
                        dataKey="sales"
                        name="Units Sold"
                        fill={theme.palette.primary.main}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <LocalHospital sx={{ fontSize: 60, mb: 1 }} />
                    <Typography>No sales data available</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tables Section */}
      <Grid container spacing={3}>
        {/* Top Selling Medicines Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: theme.shadows[2] }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Top Selling Medicines
              </Typography>
              {stats.topSellingMedicines.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Medicine
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Units Sold
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.topSellingMedicines.map((medicine, index) => (
                        <TableRow
                          key={index}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{medicine.name}</TableCell>
                          <TableCell align="right">
                            {medicine.totalSold.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography>No top-selling medicines yet.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Medicines Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: theme.shadows[2] }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Low Stock Medicines
              </Typography>
              {stats.lowStockMedicines.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Medicine
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Stock Level
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.lowStockMedicines.map((medicine, index) => (
                        <TableRow
                          key={index}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            backgroundColor:
                              medicine.stockLevel < 10
                                ? `${theme.palette.error.light}30`
                                : "inherit",
                          }}
                        >
                          <TableCell>{medicine.name}</TableCell>
                          <TableCell align="right">
                            {medicine.stockLevel}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography>All medicines are well-stocked.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
