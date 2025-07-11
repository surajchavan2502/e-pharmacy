/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import API from "../../utils/API";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Chip,
  Box,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ShoppingCart, FavoriteBorder, Favorite } from "@mui/icons-material";
import ConfirmDialog from "../../utils/ConfirmDialog";
import { motion } from "framer-motion";

const defaultImages = [
  "https://png.pngtree.com/png-clipart/20250106/original/pngtree-medicine-png-image_4960461.png",
  "https://img.freepik.com/premium-photo/pill-bottle-white-background_55883-284.jpg",
  "https://png.pngtree.com/png-clipart/20250107/original/pngtree-medicine-png-image_4608343.png",
  "https://img.freepik.com/premium-photo/blue-pills-s-bottle-isolated-white-background_106006-2619.jpg",
  "https://img.freepik.com/free-psd/still-life-pill-box-isolated_23-2150801544.jpg",
  "https://img.freepik.com/premium-photo/assorted-pills-plastic-pills-container-white_434420-2713.jpg?w=826",
];

const getRandomImage = () =>
  defaultImages[Math.floor(Math.random() * defaultImages.length)];

const UserMedicines = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cartLoading, setCartLoading] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    medicineId: null,
  });

  const limit = isMobile ? 6 : 10;

  useEffect(() => {
    fetchMedicines(currentPage);
  }, [currentPage]);

  const fetchMedicines = async (page) => {
    try {
      setLoading(true);
      const response = await API.get(
        `/api/protected/admin/user/medicines/medicines?page=${page}&limit=${limit}`
      );
      if (response.data?.data) {
        setMedicines(response.data.data.medicines || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch medicines",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (medicineId) => {
    try {
      setCartLoading(medicineId);
      const response = await API.post(
        "/api/protected/admin/user/medicines/add-cart",
        {
          medicineId,
          quantity: 1,
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Medicine added to cart successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding medicine to cart:", error);
      setSnackbar({
        open: true,
        message: "Failed to add medicine to cart",
        severity: "error",
      });
    } finally {
      setCartLoading(null);
    }
  };

  const toggleFavorite = (medicineId) => {
    setFavorites((prev) =>
      prev.includes(medicineId)
        ? prev.filter((id) => id !== medicineId)
        : [...prev, medicineId]
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 4,
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2.125rem" },
        }}
      >
        Available Medicines
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" size={60} />
        </Box>
      ) : medicines.length === 0 ? (
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "text.secondary", py: 4 }}
        >
          No medicines available at the moment. Please check back later.
        </Typography>
      ) : (
        <>
          {/* Medicine Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 3,
            }}
          >
            {medicines.map((medicine, index) => (
              <motion.div
                key={medicine._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    boxShadow: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: 160,
                      bgcolor: "grey.100",
                      borderRadius: "8px 8px 0 0",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={medicine.image || getRandomImage()}
                      alt={medicine.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        p: 2,
                        bgcolor: "background.paper",
                      }}
                      loading="lazy"
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "background.paper",
                        "&:hover": {
                          bgcolor: "background.paper",
                        },
                      }}
                      onClick={() => toggleFavorite(medicine._id)}
                    >
                      {favorites.includes(medicine._id) ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                    {medicine.stock === 0 && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                        }}
                      />
                    )}
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        lineHeight: 1.2,
                        minHeight: { xs: "2.4em", sm: "2.4em" },
                      }}
                    >
                      {medicine.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 2,
                        flexGrow: 1,
                        fontSize: "0.8rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {medicine.description || "No description available."}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                        }}
                      >
                        ₹{medicine.price}
                      </Typography>
                      <Chip
                        label={medicine.stock > 0 ? "In Stock" : "Out of Stock"}
                        size="small"
                        color={medicine.stock > 0 ? "success" : "error"}
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      disabled={
                        medicine.stock === 0 || cartLoading === medicine._id
                      }
                      onClick={() =>
                        setConfirmDialog({
                          open: true,
                          medicineId: medicine._id,
                        })
                      }
                      sx={{
                        borderRadius: 1,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      {cartLoading === medicine._id ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Add to Cart"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        handleClose={() => setConfirmDialog({ open: false, medicineId: null })}
        handleConfirm={() => {
          handleAddToCart(confirmDialog.medicineId);
          setConfirmDialog({ open: false, medicineId: null });
        }}
        title="Confirm Add to Cart"
        message="Are you sure you want to add this medicine to your cart?"
      />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            bgcolor:
              snackbar.severity === "error" ? "error.main" : "success.main",
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
};

export default UserMedicines;
