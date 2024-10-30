import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true } // Assurez-vous que vous pouvez gérer les cookies si nécessaire
      );
      // Stocker le token dans le localStorage ou les cookies
      localStorage.setItem("token", response.data.token);
      setAuth(true);
      setUser(response.data.user);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      // Gérer l'erreur ici (afficher un message, etc.)
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Supprimer le token du stockage
    setAuth(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ auth, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
