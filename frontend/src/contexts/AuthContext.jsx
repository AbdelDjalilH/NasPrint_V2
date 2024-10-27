import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState();

  const login = (userData) => {
    setAuth(userData);
  };
  const logout = () => {
    setAuth(null);
  };
  console.log("auth:", auth);
  console.log("login function:", login);
  console.log("logout function:", logout);
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
