// SecondSecretPage.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const SecondSecretPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Bienvenue sur la deuxième page secrète!</h1>
      <p>Bonjour, {user ? user.email : "invité"}!</p>
    </div>
  );
};

export default SecondSecretPage;
