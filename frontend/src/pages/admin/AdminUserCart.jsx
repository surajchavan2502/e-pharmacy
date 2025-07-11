/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  Stack,
  Alert,
  Divider,
  Tooltip,
  Card,
  CardHeader,
  useTheme,
  Skeleton,
  Badge,
  IconButton,
  LinearProgress,
} from "@mui/material";
import API from "../../utils/API";
import { toast } from "react-toastify";
import {
  Check,
  Close,
  MedicalInformation,
  ShoppingCart,
  LocalPharmacy,
  ArrowBack,
  VerifiedUser,
  PendingActions,
} from "@mui/icons-material";

const AdminUserCart = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState({
    main: false,
    itemAction: false,
    bulkAction: false,
  });
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading((prev) => ({ ...prev, main: true }));
      const response = await API.get(
        `/api/protected/admin/medicines/get-prescription-cart/${userId}`
      );
      setCart(response?.data?.data?.cart || null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch user cart."
      );
    } finally {
      setLoading((prev) => ({ ...prev, main: false }));
    }
  };

  const handleApproveItem = async (itemId, approve) => {
    try {
      setLoading((prev) => ({ ...prev, itemAction: true }));
      const { data } = await API.put(
        `/api/protected/admin/medicines/approve-cart-item/${itemId}`,
        { isApproved: approve }
      );

      setCart((prev) => ({
        ...prev,
        medicines: prev.medicines.map((item) =>
          item._id === itemId ? { ...item, isApproved: approve } : item
        ),
      }));

      toast.success(
        data.message || `Item ${approve ? "approved" : "rejected"}`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${approve ? "approve" : "reject"} item`
      );
    } finally {
      setLoading((prev) => ({ ...prev, itemAction: false }));
    }
  };

  const handleBulkApprove = async (approve) => {
    try {
      setLoading((prev) => ({ ...prev, bulkAction: true }));
      const { data } = await API.put(
        `/api/protected/admin/medicines/bulk-approve-cart-items`,
        { userId, approve }
      );

      setCart((prev) => ({
        ...prev,
        medicines: prev.medicines.map((item) =>
          item.isPrescriptionRequired ? { ...item, isApproved: approve } : item
        ),
      }));

      toast.success(
        data.message || `Items ${approve ? "approved" : "rejected"}`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${approve ? "approve" : "reject"} items`
      );
    } finally {
      setLoading((prev) => ({ ...prev, bulkAction: false }));
    }
  };

  const handleGoBack = () => navigate(-1);

  const renderEmptyState = () => (
    <Card
      sx={{
        textAlign: "center",
        p: 6,
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <MedicalInformation
        sx={{
          fontSize: 60,
          mb: 2,
          color: theme.palette.text.disabled,
        }}
      />
      <Typography variant="h6" color="textSecondary" gutterBottom>
        No Prescription Items Requiring Approval
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {userId
          ? "This user has no prescription medications pending approval."
          : "No user selected."}
      </Typography>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={handleGoBack}
        sx={{ mt: 3 }}
      >
        Back to Users
      </Button>
    </Card>
  );

  const renderLoadingState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "300px",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Loading prescription cart...
      </Typography>
    </Box>
  );

  const pendingItems = cart?.medicines?.filter(
    (item) => item.isPrescriptionRequired && !item.isApproved
  );

  const approvedItems = cart?.medicines?.filter(
    (item) => item.isPrescriptionRequired && item.isApproved
  );

  const totalPrice =
    cart?.medicines?.reduce(
      (sum, item) => sum + item.medicinePrice * item.quantity,
      0
    ) || 0;

  const approvalProgress = cart?.medicines?.length
    ? Math.round(
        (approvedItems?.length /
          cart.medicines.filter((item) => item.isPrescriptionRequired).length) *
          100
      )
    : 0;

  const renderCartTable = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ boxShadow: theme.shadows[2] }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <ShoppingCart />
            </Avatar>
          }
          title={
            <Typography variant="h6" fontWeight="bold">
              Prescription Cart Summary
            </Typography>
          }
          subheader={
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                User ID: {userId}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}
              >
                <Chip
                  icon={<PendingActions />}
                  label={`${pendingItems.length} Pending`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  icon={<VerifiedUser />}
                  label={`${approvedItems.length} Approved`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`₹${totalPrice.toFixed(2)} Total`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          }
          action={
            <Button
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          }
          sx={{
            backgroundColor: theme.palette.grey[50],
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        />

        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Approval Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={approvalProgress}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              {approvalProgress}% Complete
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {approvedItems.length} of{" "}
              {approvedItems.length + pendingItems.length} approved
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={
              loading.bulkAction ? <CircularProgress size={18} /> : <Check />
            }
            onClick={() => handleBulkApprove(true)}
            disabled={
              loading.bulkAction || loading.main || pendingItems.length === 0
            }
            sx={{ borderRadius: 2, px: 3 }}
          >
            Approve All
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={
              loading.bulkAction ? <CircularProgress size={18} /> : <Close />
            }
            onClick={() => handleBulkApprove(false)}
            disabled={
              loading.bulkAction || loading.main || pendingItems.length === 0
            }
            sx={{ borderRadius: 2, px: 3 }}
          >
            Reject All
          </Button>
        </Box>
      </Card>

      <Card sx={{ boxShadow: theme.shadows[2] }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    width: "40%",
                  }}
                >
                  Medicine Details
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    width: "15%",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    width: "15%",
                  }}
                >
                  Price
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    width: "15%",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    width: "15%",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.medicines.map((item) => (
                <TableRow
                  key={item._id}
                  hover
                  sx={{
                    "&:last-child td": { border: 0 },
                    backgroundColor: item.isApproved
                      ? `${theme.palette.success.light}08`
                      : "inherit",
                  }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        src={item.medicineImage}
                        alt={item.medicineName}
                        sx={{ width: 48, height: 48 }}
                      >
                        {!item.medicineImage && <LocalPharmacy />}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>
                          {item.medicineName}
                        </Typography>
                        {item.isPrescriptionRequired && (
                          <Chip
                            label="Requires Prescription"
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Badge
                      badgeContent={item.quantity}
                      color="primary"
                      max={999}
                      sx={{
                        "& .MuiBadge-badge": {
                          right: -12,
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>
                      ₹{(item.medicinePrice * item.quantity).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ₹{item.medicinePrice.toFixed(2)} each
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        item.isApproved ? (
                          <Check fontSize="small" />
                        ) : (
                          <PendingActions fontSize="small" />
                        )
                      }
                      label={item.isApproved ? "Approved" : "Pending"}
                      color={item.isApproved ? "success" : "warning"}
                      size="small"
                      variant={item.isApproved ? "filled" : "outlined"}
                      sx={{ minWidth: 90 }}
                    />
                  </TableCell>
                  <TableCell>
                    {!item.isApproved && item.isPrescriptionRequired && (
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => handleApproveItem(item._id, true)}
                            disabled={loading.itemAction}
                            sx={{
                              backgroundColor: `${theme.palette.success.light}20`,
                              "&:hover": {
                                backgroundColor: `${theme.palette.success.light}30`,
                              },
                            }}
                          >
                            <Check fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            color="error"
                            onClick={() => handleApproveItem(item._id, false)}
                            disabled={loading.itemAction}
                            sx={{
                              backgroundColor: `${theme.palette.error.light}20`,
                              "&:hover": {
                                backgroundColor: `${theme.palette.error.light}30`,
                              },
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Prescription Approval
      </Typography>

      {!userId ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please select a user to view their prescription cart.
        </Alert>
      ) : loading.main ? (
        renderLoadingState()
      ) : !cart || cart.medicines.length === 0 ? (
        renderEmptyState()
      ) : (
        renderCartTable()
      )}
    </Box>
  );
};

export default AdminUserCart;
