import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import {
  Home,
  Product,
  Products,
  AboutPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  OrderSuccess,
} from "./pages";

import FeedbackPage from "./pages/FeedbackPage"; // ✅ NEW

// Dashboard pages
import DashboardLayout   from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardOrders   from "./pages/dashboard/DashboardOrders";
import DashboardProfile  from "./pages/dashboard/DashboardProfile";
import DashboardAddress  from "./pages/dashboard/DashboardAddress";
import DashboardWishlist from "./pages/dashboard/DashboardWishlist";
import DashboardSettings from "./pages/dashboard/DashboardSettings";

import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          {/* Public routes */}
          <Route path="/"            element={<Home />} />
          <Route path="/product"     element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about"       element={<AboutPage />} />
          <Route path="/feedback"    element={<FeedbackPage />} /> {/* ✅ renamed from /contact */}
          <Route path="/cart"        element={<Cart />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/checkout"    element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Dashboard — nested routes, auth handled inside DashboardLayout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index            element={<DashboardOverview />} />
            <Route path="orders"   element={<DashboardOrders />} />
            <Route path="profile"  element={<DashboardProfile />} />
            <Route path="address"  element={<DashboardAddress />} />
            <Route path="wishlist" element={<DashboardWishlist />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>

          {/* 404 */}
          <Route path="/product/*" element={<PageNotFound />} />
          <Route path="*"          element={<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);