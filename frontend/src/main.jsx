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
import SecretPage from "./pages/SecretPage.jsx";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import SecondSecretPage from "./pages/SecondSecretPage.jsx";
import UserManagement from "./pages/UserManagement.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { element: <Home />, path: "/" },
      { element: <APropos />, path: "/a-propos" },
      { element: <NosProduits />, path: "/nos-produits" },
      { element: <Register />, path: "/inscription" },
      { element: <Connexion />, path: "/connexion" },
      // { element: <SecretPage />, path: "/secret-page" }, // Ajoutez une route pour la page secrète
      { element: <SecondSecretPage />, path: "/second-secret-page" },
      { element: <UserManagement />, path: "/user-management" },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
