import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import API from "../utils/API";
import { useNavigate } from "react-router";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Navigation hook

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password validation function
  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
      password
    );
  };

  // Handle Signup
  const handleSignup = async () => {
    const { fname, lname, email, password, phone, street, city, state, zip } =
      formData;

    // Validation
    if (
      !fname ||
      !lname ||
      !email ||
      !password ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !zip
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 6 characters, 1 number, and 1 special character."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/public/auth/signup", {
        fname,
        lname,
        email,
        password,
        phone,
        address: { street, city, state, zip },
      });

      if (res.data.status === 200) {
        toast.success("Signup Successful! Redirecting...");
        navigate("/", { replace: true });
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create Your Account
        </Typography>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* First Name */}
          <Grid item xs={6}>
            <TextField
              label="First Name"
              name="fname"
              fullWidth
              required
              value={formData.fname}
              onChange={handleChange}
            />
          </Grid>
          {/* Last Name */}
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              name="lname"
              fullWidth
              required
              value={formData.lname}
              onChange={handleChange}
            />
          </Grid>
          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          {/* Password */}
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          {/* Phone */}
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Street Address"
              name="street"
              fullWidth
              required
              value={formData.street}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="City"
              name="city"
              fullWidth
              required
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="State"
              name="state"
              fullWidth
              required
              value={formData.state}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="ZIP Code"
              name="zip"
              fullWidth
              required
              value={formData.zip}
              onChange={handleChange}
            />
          </Grid>
          {/* Signup Button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </Grid>
          {/* Signin Link */}
          <Grid item xs={12} textAlign="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <a href="/" style={{ color: "#1976D2", textDecoration: "none" }}>
                Sign in
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignUp;
