// /* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from "react";
// import API from "../../utils/API";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   IconButton,
//   Divider,
// } from "@mui/material";
// import { MdDelete, MdAdd, MdRemove } from "react-icons/md";
// import { useNavigate } from "react-router"; // Import useNavigate

// const defaultImages = [
//   "https://png.pngtree.com/png-clipart/20250106/original/pngtree-medicine-png-image_4960461.png",
//   "https://img.freepik.com/premium-photo/pill-bottle-white-background_55883-284.jpg",
//   "https://png.pngtree.com/png-clipart/20250107/original/pngtree-medicine-png-image_4608343.png",
//   "https://img.freepik.com/premium-photo/blue-pills-s-bottle-isolated-white-background_106006-2619.jpg",
//   "https://img.freepik.com/free-psd/still-life-pill-box-isolated_23-2150801544.jpg",
//   "https://img.freepik.com/premium-photo/assorted-pills-plastic-pills-container-white_434420-2713.jpg?w=826",
// ];

// const UserCart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate(); // Hook for navigation

//   // Function to get a random default image
//   const getDefaultImage = () => {
//     const randomIndex = Math.floor(Math.random() * defaultImages.length);
//     return defaultImages[randomIndex];
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const response = await API.get(
//         "/api/protected/admin/user/medicines/cart"
//       );

//       // Filter out items with null medicineId
//       const medicines = (response.data.data.medicines || []).filter(
//         (item) => item.medicineId !== null
//       );

//       const cartWithQuantity = medicines.map((item) => ({
//         ...item.medicineId, // Correct source of medicine data
//         quantity: item.quantity || 1,
//         isPrescriptionRequired: item.isPrescriptionRequired,
//         isApproved: item.isApproved,
//         medicineId: item.medicineId._id, // Proper ID reference
//         // Use medicine image if available, otherwise use a random default image
//         image: item.medicineId.image || getDefaultImage(),
//       }));

//       setCartItems(cartWithQuantity);
//     } catch (error) {
//       console.error(
//         "Error fetching cart:",
//         error.response?.data || error.message
//       );
//       setCartItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (medicineId, newQuantity) => {
//     if (newQuantity < 1) return;

//     try {
//       const response = await API.put(
//         `/api/protected/admin/user/medicines/cart/update/${medicineId}`,
//         { quantity: newQuantity }
//       );

//       setCartItems((prevItems) =>
//         prevItems.map((item) =>
//           item.medicineId === medicineId
//             ? { ...item, quantity: newQuantity }
//             : item
//         )
//       );
//     } catch (error) {
//       console.error(
//         "Error updating quantity:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const removeItem = async (medicineId) => {
//     try {
//       await API.delete(
//         `/api/protected/admin/user/medicines/delete/${medicineId}`
//       );
//       fetchCart(); // Refresh cart after deletion
//     } catch (error) {
//       console.error(
//         "Error removing item:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const totalAmount = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
//       <Typography variant="h4" className="font-bold text-gray-900 mb-6">
//         My Cart ({cartItems.length} items)
//       </Typography>

//       {loading ? (
//         <p className="text-center text-lg font-semibold">Loading...</p>
//       ) : cartItems.length === 0 ? (
//         <Typography className="text-gray-500 text-center text-xl">
//           Your cart is empty. Start shopping now!
//         </Typography>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Left Section: Cart Items */}
//           <div className="md:col-span-2 space-y-4">
//             {cartItems.map((item) => (
//               <Card key={item.medicineId} className="shadow-md rounded-lg">
//                 <CardContent className="flex items-center justify-between">
//                   <div className="flex items-center space-x-6">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-24 h-24 object-cover rounded-md"
//                       onError={(e) => {
//                         // Fallback to default image if the image fails to load
//                         e.target.src = getDefaultImage();
//                       }}
//                     />
//                     <div>
//                       <Typography variant="h6" className="font-semibold">
//                         {item.name}
//                       </Typography>
//                       <Typography variant="body1" className="text-gray-700">
//                         ₹{item.price.toFixed(2)}
//                       </Typography>
//                       {item.isPrescriptionRequired && (
//                         <Typography
//                           variant="body2"
//                           className="text-yellow-600 font-medium"
//                         >
//                           Prescription Required
//                         </Typography>
//                       )}
//                       <Typography
//                         variant="body2"
//                         className={`font-medium ${
//                           item.isApproved ? "text-green-600" : "text-orange-600"
//                         }`}
//                       >
//                         {item.isApproved ? "Approved" : "Pending Approval"}
//                       </Typography>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <IconButton
//                       onClick={() =>
//                         updateQuantity(item.medicineId, item.quantity - 1)
//                       }
//                       className="bg-gray-200 hover:bg-gray-300"
//                     >
//                       <MdRemove />
//                     </IconButton>
//                     <Typography className="text-lg font-semibold">
//                       {item.quantity}
//                     </Typography>
//                     <IconButton
//                       onClick={() =>
//                         updateQuantity(item.medicineId, item.quantity + 1)
//                       }
//                       className="bg-gray-200 hover:bg-gray-300"
//                     >
//                       <MdAdd />
//                     </IconButton>
//                     <IconButton onClick={() => removeItem(item.medicineId)}>
//                       <MdDelete className="text-red-500" />
//                     </IconButton>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           {/* Right Section: Price Details */}
//           <div className="bg-white p-6 shadow-lg rounded-lg">
//             <Typography variant="h5" className="font-semibold mb-4">
//               Price Details
//             </Typography>
//             <Divider />
//             <div className="flex justify-between mt-4">
//               <Typography>Subtotal</Typography>
//               <Typography>₹{totalAmount.toFixed(2)}</Typography>
//             </div>
//             <div className="flex justify-between mt-2">
//               <Typography>Delivery Charges</Typography>
//               <Typography className="text-green-600">Free</Typography>
//             </div>
//             <Divider className="my-4" />
//             <div className="flex justify-between font-bold text-lg">
//               <Typography>Total Amount</Typography>
//               <Typography>₹{totalAmount.toFixed(2)}</Typography>
//             </div>
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               className="mt-4 py-3 text-lg"
//               disabled={cartItems.some(
//                 (item) => item.isPrescriptionRequired && !item.isApproved
//               )}
//               onClick={() => {
//                 // Using navigate to programmatically go to the checkout page
//                 navigate("/user/checkout", {
//                   state: { cartItems, totalAmount },
//                 });
//               }}
//             >
//               {cartItems.some(
//                 (item) => item.isPrescriptionRequired && !item.isApproved
//               )
//                 ? "Approval Pending"
//                 : "Proceed to Checkout"}
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserCart;
import React, { useState, useEffect } from "react";
import API from "../../utils/API";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Divider,
  Box,
  Grid,
  Paper,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  CircularProgress,
  Chip,
  useTheme,
} from "@mui/material";
import { Delete, Add, Remove, ShoppingCartCheckout } from "@mui/icons-material";
import { useNavigate } from "react-router";

const defaultImages = [
  "https://png.pngtree.com/png-clipart/20250106/original/pngtree-medicine-png-image_4960461.png",
  "https://img.freepik.com/premium-photo/pill-bottle-white-background_55883-284.jpg",
  "https://png.pngtree.com/png-clipart/20250107/original/pngtree-medicine-png-image_4608343.png",
  "https://img.freepik.com/premium-photo/blue-pills-s-bottle-isolated-white-background_106006-2619.jpg",
  "https://img.freepik.com/free-psd/still-life-pill-box-isolated_23-2150801544.jpg",
  "https://img.freepik.com/premium-photo/assorted-pills-plastic-pills-container-white_434420-2713.jpg?w=826",
];

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const getDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        "/api/protected/admin/user/medicines/cart"
      );

      const medicines = (response.data.data.medicines || []).filter(
        (item) => item.medicineId !== null
      );

      const cartWithQuantity = medicines.map((item) => ({
        ...item.medicineId,
        quantity: item.quantity || 1,
        isPrescriptionRequired: item.isPrescriptionRequired,
        isApproved: item.isApproved,
        medicineId: item.medicineId._id,
        image: item.medicineId.image || getDefaultImage(),
      }));

      setCartItems(cartWithQuantity);
    } catch (error) {
      console.error(
        "Error fetching cart:",
        error.response?.data || error.message
      );
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (medicineId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(medicineId);
      await API.put(
        `/api/protected/admin/user/medicines/cart/update/${medicineId}`,
        {
          quantity: newQuantity,
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.medicineId === medicineId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error updating quantity:",
        error.response?.data || error.message
      );
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (medicineId) => {
    try {
      setUpdating(medicineId);
      await API.delete(
        `/api/protected/admin/user/medicines/delete/${medicineId}`
      );
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.medicineId !== medicineId)
      );
    } catch (error) {
      console.error(
        "Error removing item:",
        error.response?.data || error.message
      );
    } finally {
      setUpdating(null);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        My Shopping Cart
        {cartItems.length > 0 && (
          <Chip
            label={`${cartItems.length} items`}
            color="primary"
            size="small"
            sx={{ ml: 2, height: 24 }}
          />
        )}
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="40vh"
        >
          <CircularProgress size={60} />
        </Box>
      ) : cartItems.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
          <ShoppingCartCheckout
            sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Looks like you haven't added any items yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/user/medicines")}
          >
            Browse Medicines
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <List>
                {cartItems.map((item) => (
                  <React.Fragment key={item.medicineId}>
                    <ListItem sx={{ py: 3 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 80, height: 80, mr: 2 }}
                          variant="rounded"
                          onError={(e) => {
                            e.target.src = getDefaultImage();
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6" fontWeight={600}>
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body1" sx={{ mt: 0.5 }}>
                              ₹{item.price.toFixed(2)}
                            </Typography>
                            {item.isPrescriptionRequired && (
                              <Box sx={{ mt: 1 }}>
                                <Chip
                                  label="Prescription Required"
                                  color="warning"
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                <Chip
                                  label={
                                    item.isApproved
                                      ? "Approved"
                                      : "Pending Approval"
                                  }
                                  color={
                                    item.isApproved ? "success" : "default"
                                  }
                                  size="small"
                                />
                              </Box>
                            )}
                          </>
                        }
                      />
                      <ListItemSecondaryAction
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mr: 3 }}
                        >
                          <IconButton
                            onClick={() =>
                              updateQuantity(item.medicineId, item.quantity - 1)
                            }
                            disabled={
                              updating === item.medicineId || item.quantity <= 1
                            }
                            size="small"
                            sx={{
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography
                            sx={{ mx: 2, minWidth: 24, textAlign: "center" }}
                          >
                            {updating === item.medicineId ? (
                              <CircularProgress size={20} />
                            ) : (
                              item.quantity
                            )}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              updateQuantity(item.medicineId, item.quantity + 1)
                            }
                            disabled={updating === item.medicineId}
                            size="small"
                            sx={{
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                        <IconButton
                          onClick={() => removeItem(item.medicineId)}
                          disabled={updating === item.medicineId}
                          color="error"
                        >
                          {updating === item.medicineId ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Delete />
                          )}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">
                    Subtotal ({cartItems.length} items)
                  </Typography>
                  <Typography variant="body1">
                    ₹{totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Delivery Charges</Typography>
                  <Typography variant="body1" color="success.main">
                    Free
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Total Amount
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  ₹{totalAmount.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<ShoppingCartCheckout />}
                disabled={cartItems.some(
                  (item) => item.isPrescriptionRequired && !item.isApproved
                )}
                onClick={() => {
                  navigate("/user/checkout", {
                    state: { cartItems, totalAmount },
                  });
                }}
                sx={{ py: 1.5 }}
              >
                {cartItems.some(
                  (item) => item.isPrescriptionRequired && !item.isApproved
                )
                  ? "Approval Pending"
                  : "Proceed to Checkout"}
              </Button>

              {cartItems.some((item) => item.isPrescriptionRequired) && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  * Prescription items require approval before checkout
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default UserCart;
