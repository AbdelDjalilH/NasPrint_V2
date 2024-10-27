import { useState } from "react";
import "../styles/connexion.css";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { auth, login } = useAuth() || {}; // Gérer le cas où useAuth retourne null

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3335/auth/login", {
        email,
        password,
      });

      if (login) {
        // Vérifie que login est bien défini
        login(response.data.user);
      } else {
        console.error("La fonction login n'est pas disponible.");
      }
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <section className="connexion-section">
        <form onSubmit={handleLogin} className="connexion-form">
          <h1 className="connexion-title">Connectez-vous!</h1>
          <div className="input-container-connexion">
            <input
              type="text"
              placeholder="Votre adresse mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="connexion-btn">
              Se connecter
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
