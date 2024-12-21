import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Home from "./pages/Home.jsx";
import APropos from "./pages/APropos.jsx";
import NosProduits from "./pages/NosProduits.jsx";
import Register from "./pages/Register.jsx";
import Connexion from "./pages/Connexion.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "react-use-cart";
import { OrderProvider } from "./contexts/OrdersContext";
import UserManagement from "./pages/UserManagement.jsx";
import ProductInfo from "./pages/ProductInfo.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ClientInfo from "./pages/ClientInfo.jsx";
import DetailProduct from "./pages/DetailProduct.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentComplete from "./pages/PaymentComplete.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import VerifyOtp from "./pages/VerifyOtp";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { element: <Home />, path: "/" },
      { element: <APropos />, path: "/a-propos" },
      { element: <NosProduits />, path: "/nos-produits" },
      { element: <Register />, path: "/inscription" },
      { element: <Connexion />, path: "/connexion" },
      { element: <UserManagement />, path: "/user-management" },
      { element: <AdminPage />, path: "/admin-page" },
      { element: <ProductInfo />, path: "/product-info" },
      { element: <ClientInfo />, path: "/client-info" },
      { element: <DetailProduct />, path: "/nos-produits/:id" },
      { element: <PaymentPage />, path: "/payment-page" },
      { element: <PaymentComplete />, path: "/payment-complete" },
      { element: <ContactPage />, path: "/contact-page" },
      { element: <VerifyOtp />, path: "/verification-otp" },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          {" "}
          {/* Enveloppe votre application avec OrderProvider */}
          <RouterProvider router={router} />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
