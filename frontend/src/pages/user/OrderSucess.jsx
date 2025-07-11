import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle } from "@mui/icons-material";
import {
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/user");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        px: 3,
        textAlign: "center",
        backgroundColor: "background.default",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            backgroundColor: "success.light",
            borderRadius: "50%",
            width: 80,
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <CheckCircle sx={{ fontSize: 48, color: "success.contrastText" }} />
        </Box>
      </motion.div>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 2,
          color: "text.primary",
        }}
      >
        Order Confirmed
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 3,
          color: "text.secondary",
          maxWidth: "80%",
          mx: "auto",
          lineHeight: 1.6,
        }}
      >
        Your order has been successfully placed. We've sent a confirmation email
        with all the details.
      </Typography>

      <Box
        sx={{
          backgroundColor: "action.hover",
          borderRadius: 2,
          p: 3,
          mb: 4,
          width: "100%",
          maxWidth: 400,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          Order Number:{" "}
          <strong>#ORD-{Math.floor(Math.random() * 10000)}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Estimated delivery:{" "}
          <strong>
            {new Date(Date.now() + 86400000 * 3).toLocaleDateString()}
          </strong>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/orders")}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.9375rem",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            },
          }}
        >
          View Order Details
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/")}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "0.9375rem",
          }}
        >
          Continue Shopping
        </Button>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.disabled",
          mt: 2,
        }}
      >
        <CircularProgress size={14} thickness={5} sx={{ mr: 1 }} />
        Redirecting to account in {countdown} seconds...
      </Typography>
    </Container>
  );
};

export default OrderSuccess;
