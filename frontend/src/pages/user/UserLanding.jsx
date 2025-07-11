import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  FaPrescriptionBottleAlt,
  FaTruck,
  FaCapsules,
  FaSearch,
  FaArrowRight,
  FaStar,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router";
import API from "../../utils/API";

const defaultImages = [
  "https://png.pngtree.com/png-clipart/20250106/original/pngtree-medicine-png-image_4960461.png",
  "https://img.freepik.com/premium-photo/pill-bottle-white-background_55883-284.jpg",
  "https://png.pngtree.com/png-clipart/20250107/original/pngtree-medicine-png-image_4608343.png",
  "https://img.freepik.com/premium-photo/blue-pills-s-bottle-isolated-white-background_106006-2619.jpg",
  "https://img.freepik.com/free-psd/still-life-pill-box-isolated_23-2150801544.jpg",
  "https://img.freepik.com/premium-photo/assorted-pills-plastic-pills-container-white_434420-2713.jpg",
];

const getRandomImage = () => {
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};

const UserLandingPage = () => {
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFeaturedMedicines();
  }, []);

  const fetchFeaturedMedicines = async () => {
    try {
      const response = await API.get(
        "/api/protected/admin/user/medicines/medicines?limit=4"
      );
      setFeaturedMedicines(response.data.data.medicines || []);
    } catch (error) {
      console.error("Error fetching featured medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#e0f7fa] to-[#b2ebf2] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00838f] opacity-10"></div>
        <Container maxWidth="lg" className="py-16 md:py-24 relative z-10">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="space-y-6">
                <Typography
                  variant="h2"
                  className="text-4xl md:text-5xl font-bold leading-tight text-gray-900"
                >
                  Your Health, <br className="hidden md:block" /> Our{" "}
                  <span className="text-[#00838f]">Priority</span>
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="text-lg text-gray-700"
                >
                  Get genuine medicines delivered to your doorstep with
                  exclusive discounts and personalized care.
                </Typography>

                {/* Search Bar */}
                <Box className="relative w-full max-w-md">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search for medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white rounded-lg shadow-sm"
                    InputProps={{
                      startAdornment: (
                        <FaSearch className="text-gray-500 text-xl mr-3" />
                      ),
                      style: {
                        borderRadius: "12px",
                        height: "56px",
                      },
                    }}
                  />
                </Box>

                {/* CTA Buttons */}
                <Box className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link to="/user/medicines" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      className="px-8 py-3 shadow-md hover:shadow-lg transition"
                      style={{
                        backgroundColor: "#00838f",
                        borderRadius: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Shop Now
                    </Button>
                  </Link>
                  <Link to="/user/medicines" style={{ textDecoration: "none" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      className="px-8 py-3 shadow-md hover:shadow-lg transition"
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Explore More
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Grid>

            {/* Right: Featured Cards */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {[
                  {
                    title: "Prescription Refill",
                    desc: "Upload and reorder medicines easily.",
                    icon: (
                      <FaPrescriptionBottleAlt
                        size={40}
                        className="text-[#00838f]"
                      />
                    ),
                    label: "New",
                    bgColor: "#e0f7fa",
                  },
                  {
                    title: "Fast & Secure Delivery",
                    desc: "Safe & speedy delivery to your doorstep.",
                    icon: <FaTruck size={40} className="text-[#00838f]" />,
                    label: "Popular",
                    bgColor: "#e0f7fa",
                  },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      className="shadow-lg rounded-xl hover:shadow-xl transition-transform transform hover:-translate-y-2 h-full"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      <CardContent className="p-6">
                        <Chip
                          label={item.label}
                          size="small"
                          style={{
                            backgroundColor:
                              index === 0 ? "#4caf50" : "#ff9800",
                            color: "white",
                            fontWeight: "500",
                          }}
                        />
                        <Box className="mt-4 mb-6">{item.icon}</Box>
                        <Typography
                          variant="h6"
                          className="font-semibold"
                          style={{ color: "#006064" }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-gray-600 mt-2"
                        >
                          {item.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Featured Medicines Section */}
      <section className="py-16 bg-white">
        <Container maxWidth="lg">
          <Box className="flex flex-wrap justify-between items-center mb-12">
            <Typography
              variant="h4"
              className="font-bold"
              style={{ color: "#006064" }}
            >
              Featured Medicines
            </Typography>
            <Link to="/user/medicines" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                color="primary"
                endIcon={<FaArrowRight />}
                style={{ fontWeight: "600" }}
              >
                View All
              </Button>
            </Link>
          </Box>

          {loading ? (
            <Box className="text-center py-12">
              <CircularProgress style={{ color: "#00838f" }} />
              <Typography variant="body1" className="mt-4 text-gray-600">
                Loading featured medicines...
              </Typography>
            </Box>
          ) : featuredMedicines.length === 0 ? (
            <Box className="text-center py-12">
              <Typography variant="body1" className="text-gray-600">
                No featured medicines available at the moment.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {featuredMedicines.map((medicine) => (
                <Grid item xs={12} sm={6} md={3} key={medicine._id}>
                  <Card className="shadow-md rounded-2xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 h-full flex flex-col p-4">
                    <Box className="relative">
                      <Box className="h-48 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                          src={medicine.image || getRandomImage()}
                          alt={medicine.name}
                          className="h-full w-full object-contain p-4"
                          loading="lazy"
                        />
                      </Box>

                      <IconButton
                        className="absolute top-2 right-0"
                        style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                        size="small"
                      >
                        <FaHeart className="text-gray-600 hover:text-red-500" />
                      </IconButton>

                      {medicine.discount && (
                        <Chip
                          label={`${medicine.discount}% OFF`}
                          className="absolute top-2 left-2"
                          size="small"
                          style={{
                            backgroundColor: "#ff5722",
                            color: "white",
                            fontWeight: "600",
                          }}
                        />
                      )}
                    </Box>

                    <CardContent className="flex-grow flex flex-col justify-between">
                      <div>
                        <Typography
                          variant="h6"
                          className="font-semibold mb-2"
                          style={{ color: "#006064", fontSize: "1.1rem" }}
                        >
                          {medicine.name}
                        </Typography>

                        <Box className="flex items-center mb-2">
                          <Box className="flex text-yellow-500 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                size={16}
                                className={
                                  i < Math.round(medicine.rating || 4)
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </Box>
                          <Typography
                            variant="caption"
                            className="text-gray-500 ml-1"
                          >
                            ({medicine.rating || 4.0})
                          </Typography>
                        </Box>
                      </div>

                      <Box className="flex items-center justify-between mt-4">
                        <Box>
                          {medicine.discount ? (
                            <>
                              <Typography
                                variant="body1"
                                className="font-bold text-green-600"
                              >
                                ₹{medicine.price}
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-gray-400 line-through ml-2"
                              ></Typography>
                            </>
                          ) : (
                            <Typography
                              variant="body1"
                              className="font-bold"
                              style={{ color: "#00838f" }}
                            >
                              ₹{medicine.price}
                            </Typography>
                          )}
                        </Box>

                        <Button
                          variant="contained"
                          color="primary"
                          size="medium"
                          startIcon={<FaShoppingCart />}
                          className="rounded-full"
                          style={{
                            backgroundColor: "#00838f",
                            paddingLeft: "20px",
                            paddingRight: "20px",
                            fontWeight: "600",
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#e0f7fa]">
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            className="text-center font-bold mb-12"
            style={{ color: "#006064" }}
          >
            Why Choose Our Pharmacy?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: (
                  <FaPrescriptionBottleAlt
                    size={32}
                    className="text-[#00838f]"
                  />
                ),
                title: "100% Genuine Medicines",
                description:
                  "All our medicines are sourced directly from verified manufacturers.",
              },
              {
                icon: <FaTruck size={32} className="text-[#00838f]" />,
                title: "Fast Delivery",
                description: "Get your medicines delivered within 24-48 hours.",
              },
              {
                icon: <FaCapsules size={32} className="text-[#00838f]" />,
                title: "Wide Selection",
                description: "Over 10,000+ medicines and healthcare products.",
              },
              {
                icon: <FaStar size={32} className="text-[#00838f]" />,
                title: "Expert Pharmacists",
                description:
                  "24/7 support from qualified healthcare professionals.",
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition h-full text-center">
                  <Box className="bg-[#b2ebf2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    className="font-semibold mb-2"
                    style={{ color: "#006064" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-[#006064] text-white py-8">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" className="font-bold mb-4">
                MediCare Pharmacy
              </Typography>
              <Typography variant="body2" className="text-gray-300">
                Your trusted partner for all your healthcare needs. We provide
                genuine medicines with fast delivery.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" className="font-semibold mb-4">
                Quick Links
              </Typography>
              <Box className="space-y-2">
                <Link to="/" className="block text-gray-300 hover:text-white">
                  Home
                </Link>
                <Link
                  to="/medicines"
                  className="block text-gray-300 hover:text-white"
                >
                  Medicines
                </Link>
                <Link
                  to="/prescriptions"
                  className="block text-gray-300 hover:text-white"
                >
                  Prescriptions
                </Link>
                <Link
                  to="/offers"
                  className="block text-gray-300 hover:text-white"
                >
                  Offers
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" className="font-semibold mb-4">
                Support
              </Typography>
              <Box className="space-y-2">
                <Link
                  to="/contact"
                  className="block text-gray-300 hover:text-white"
                >
                  Contact Us
                </Link>
                <Link
                  to="/faq"
                  className="block text-gray-300 hover:text-white"
                >
                  FAQ
                </Link>
                <Link
                  to="/privacy"
                  className="block text-gray-300 hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="block text-gray-300 hover:text-white"
                >
                  Terms
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" className="font-semibold mb-4">
                Newsletter
              </Typography>
              <Box className="flex">
                <TextField
                  variant="outlined"
                  placeholder="Your email"
                  size="small"
                  className="flex-grow bg-white rounded-l"
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#00838f" }}
                >
                  Subscribe
                </Button>
              </Box>
              <Typography
                variant="caption"
                className="text-gray-300 mt-2 block"
              >
                Get updates on special offers and health tips.
              </Typography>
            </Grid>
          </Grid>
          <Box className="border-t border-gray-700 mt-8 pt-6 text-center">
            <Typography variant="body2" className="text-gray-300">
              © {new Date().getFullYear()} MediCare Pharmacy. All Rights
              Reserved.
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default UserLandingPage;
