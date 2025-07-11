import React from "react";

import { Route, Routes } from "react-router";
import Signin from "./pages/Signin";
import AdminLayout from "./pages/admin/AdminLayout";
import UserLayout from "./pages/user/UserLayout";
import AdminUser from "./pages/admin/AdminUser";
import UpdateUser from "./pages/admin/UpdateUser";
import AdminMedicines from "./pages/admin/AdminMedicines";
import CreateMedicine from "./pages/admin/CreateMedicine";
import UpdateMedicines from "./pages/admin/UpdateMedicines";
import UserCart from "./pages/user/UserCart";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserCart from "./pages/admin/AdminUserCart";
import UserProfile from "./pages/user/UserProfile";
import UserMedicines from "./pages/user/UserMedicines";
import UserLandingPage from "./pages/user/UserLanding";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/user/Checkout";
import OrderSucess from "./pages/user/OrderSucess";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/**for the admin only */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUser />} />
          <Route path="/admin/users/update/:id" element={<UpdateUser />} />
          <Route path="/admin/users/cart" element={<AdminUserCart />} />
          <Route path="medicines" element={<AdminMedicines />} />
          <Route path="/admin/medicines/create" element={<CreateMedicine />} />
          <Route
            path="/admin/medicines/update/:id"
            element={<UpdateMedicines />}
          />
          <Route path="/admin/users/cart" element={<UserCart />} />
        </Route>

        {/** for the user only */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="/user" element={<UserLandingPage />} />
          <Route path="medicines" element={<UserMedicines />} />
          <Route path="cart" element={<UserCart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSucess />} />

          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/** for the auth */}
        <Route path="signup" element={<SignUp />} />
        <Route path="/" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
