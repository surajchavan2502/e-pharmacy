
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Box,
  Stepper,
  Step,
  Grid,
  StepLabel,
  Alert,
  Paper,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
} from "@mui/material";
import {
  LocalShipping,
  Payment,
  Assignment,
  CheckCircle,
  CreditCard,
  AttachMoney,
  MedicalInformation,
} from "@mui/icons-material";
import API from "../../utils/API";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { cartItems = [], totalAmount = 0 } = location.state || {};

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get(
          "/api/protected/admin/user/profile/profile"
        );
        const userData = response.data.data || {};
        setUser(userData);

        setShippingAddress({
          name: `${userData.fname || ""} ${userData.lname || ""}`.trim(),
          address: [
            userData.address?.street || "",
            userData.address?.city || "",
            userData.address?.state || "",
            userData.address?.zip || "",
          ]
            .filter(Boolean)
            .join(", "),
          phoneNumber: userData.phone || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleRazorpayPayment = async () => {
    try {
      if (
        !shippingAddress.name ||
        !shippingAddress.address ||
        !shippingAddress.phoneNumber
      ) {
        throw new Error("Please fill in all shipping details");
      }

      setLoading(true);
      const orderResponse = await API.post(
        "/api/protected/admin/user/medicines/cart/payment/razorpay/create-order",
        {
          amount: totalAmount,
          shippingAddress,
        }
      );

      const { orderId, amount, currency } = orderResponse.data.data;

      const options = {
        key: "rzp_test_DD6rbL8yhMg3DQ",
        amount: amount.toString(),
        currency: currency,
        name: "e-Pharmacy",
        description: "Purchase Medicines",
        order_id: orderId,
        handler: async function (response) {
          try {
            const paymentData = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              userId: user._id,
              paymentMethod: "Razorpay",
              totalAmount: totalAmount,
            };

            const { data } = await API.post(
              "/api/protected/admin/user/medicines/buy-medicine",
              paymentData
            );

            if (data.success) {
              navigate("/user/order-success");
            } else {
              throw new Error("Order placement failed.");
            }
          } catch (err) {
            console.error("Error while saving order after payment:", err);
            setError(
              "Payment succeeded but order failed. Please contact support."
            );
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          contact: shippingAddress.phoneNumber,
        },
        theme: {
          color: theme.palette.primary.main,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Detailed payment error:", error);
      setError(
        `Payment failed: ${error.response?.data.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "COD") {
      try {
        setLoading(true);
        const orderData = {
          shippingAddress,
          cartItems,
          paymentMethod,
          userId: user?._id,
          totalAmount,
          paymentStatus: "pending",
        };

        await API.post(
          "/api/protected/admin/user/medicines/buy-medicine",
          orderData
        );
        navigate("/user/order-success", {
          state: {
            orderData,
            paymentMethod: "COD",
          },
        });
      } catch (error) {
        console.error("Error placing COD order:", error);
        setError(
          "Failed to place COD order: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    } else if (paymentMethod === "Razorpay") {
      await handleRazorpayPayment();
    }
  };

  const steps = ["Shipping", "Payment", "Review"];

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

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 4, color: "text.primary" }}
      >
        Checkout
      </Typography>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Forms */}
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    color: "primary.main",
                  }}
                >
                  <LocalShipping sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Shipping Information
                  </Typography>
                </Box>

                <TextField
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Address"
                  fullWidth
                  margin="normal"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone Number"
                  fullWidth
                  margin="normal"
                  name="phoneNumber"
                  value={shippingAddress.phoneNumber}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email Address"
                  fullWidth
                  margin="normal"
                  name="email"
                  value={shippingAddress.email}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  onClick={() => setActiveStep(1)}
                  disabled={
                    !shippingAddress.name ||
                    !shippingAddress.address ||
                    !shippingAddress.phoneNumber
                  }
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    color: "primary.main",
                  }}
                >
                  <Payment sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Payment Method
                  </Typography>
                </Box>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <Paper
                      elevation={paymentMethod === "Razorpay" ? 2 : 0}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: `1px solid ${
                          paymentMethod === "Razorpay"
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => setPaymentMethod("Razorpay")}
                    >
                      <FormControlLabel
                        value="Razorpay"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CreditCard sx={{ mr: 1 }} />
                            <Typography>Credit/Debit Card/UPI</Typography>
                          </Box>
                        }
                        sx={{ width: "100%", m: 0 }}
                      />
                    </Paper>

                    <Paper
                      elevation={paymentMethod === "COD" ? 2 : 0}
                      sx={{
                        p: 2,
                        border: `1px solid ${
                          paymentMethod === "COD"
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => setPaymentMethod("COD")}
                    >
                      <FormControlLabel
                        value="COD"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AttachMoney sx={{ mr: 1 }} />
                            <Typography>Cash on Delivery</Typography>
                          </Box>
                        }
                        sx={{ width: "100%", m: 0 }}
                      />
                    </Paper>
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(0)}
                    sx={{ mt: 3 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(2)}
                    disabled={!paymentMethod}
                    sx={{ mt: 3 }}
                  >
                    Review Order
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 3,
                    color: "primary.main",
                  }}
                >
                  <Assignment sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Review Your Order
                  </Typography>
                </Box>

                <List>
                  {cartItems.map((item) => (
                    <ListItem
                      key={item.medicineId}
                      sx={{
                        px: 0,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={item.image || "/medicine-placeholder.png"}
                          alt={item.name}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                      <Typography variant="body1" fontWeight={500}>
                        ₹{(item.price * item.quantity)?.toFixed(2)}
                      </Typography>
                      {item.isPrescriptionRequired && (
                        <Badge
                          badgeContent={
                            item.isApproved ? "Approved" : "Pending"
                          }
                          color={item.isApproved ? "success" : "warning"}
                          sx={{ ml: 2 }}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Typography variant="h6">Subtotal</Typography>
                  <Typography variant="h6">
                    ₹{totalAmount?.toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">Free</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    ₹{totalAmount?.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveStep(1)}
                    sx={{ mt: 3 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handlePlaceOrder}
                    disabled={
                      !paymentMethod ||
                      cartItems.length === 0 ||
                      cartItems.some(
                        (item) =>
                          item.isPrescriptionRequired && !item.isApproved
                      )
                    }
                    sx={{ mt: 3 }}
                    startIcon={<CheckCircle />}
                  >
                    {cartItems.some(
                      (item) => item.isPrescriptionRequired && !item.isApproved
                    )
                      ? "Approval Pending"
                      : paymentMethod === "COD"
                      ? "Place Order"
                      : "Proceed to Payment"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right Column - Order Summary */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Order Summary
              </Typography>

              <List sx={{ mb: 2 }}>
                {cartItems.slice(0, 3).map((item) => (
                  <ListItem
                    key={item.medicineId}
                    sx={{ px: 0, py: 1 }}
                    secondaryAction={
                      <Typography>
                        ₹{(item.price * item.quantity)?.toFixed(2)}
                      </Typography>
                    }
                  >
                    <ListItemText
                      primary={`${item.name} x ${item.quantity}`}
                      primaryTypographyProps={{
                        sx: { fontSize: "0.875rem" },
                      }}
                    />
                  </ListItem>
                ))}
                {cartItems.length > 3 && (
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={`+ ${cartItems.length - 3} more items`}
                      primaryTypographyProps={{
                        sx: { fontSize: "0.875rem", color: "text.secondary" },
                      }}
                    />
                  </ListItem>
                )}
              </List>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Subtotal</Typography>
                <Typography>₹{totalAmount?.toFixed(2)}</Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
              >
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight={600}>
                  ₹{totalAmount?.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Prescription Notice */}
          {cartItems.some((item) => item.isPrescriptionRequired) && (
            <Card
              variant="outlined"
              sx={{ borderRadius: 2, mt: 2, borderColor: "warning.light" }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <MedicalInformation sx={{ color: "warning.main", mr: 1 }} />
                  <Typography variant="subtitle2" color="warning.dark">
                    Prescription Required
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Some items in your cart require prescription approval before
                  shipping.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
