import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/connexion.css";
import { useAuth } from "../contexts/AuthContext";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Récupérer la méthode login du contexte
  const [error, setError] = useState(""); // État pour stocker les erreurs
  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  // Fonction de connexion
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    setLoading(true); // Activer le chargement
    setError(""); // Réinitialiser les erreurs au début de chaque tentative de connexion

    try {
      await login(email, password); // Utiliser la méthode login du contexte
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);

      // Gestion des erreurs de réponse
      if (error.response?.data?.message) {
        setError(error.response.data.message); // Assigner le message d'erreur du backend
      } else {
        setError("Erreur de connexion, veuillez réessayer."); // Message d'erreur générique
      }
    } finally {
      setLoading(false); // Désactiver le chargement dans tous les cas
    }
  };

  // Vérifiez si un token est déjà stocké dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token trouvé dans le localStorage :", token);
      // Si nécessaire, vérifier ou récupérer les infos de l'utilisateur avec le token
    }
  }, []);

  return (
    <div>
      <section className="connexion-section">
        <form onSubmit={handleLogin} className="connexion-form">
          <h1 className="connexion-title">Connectez-vous!</h1>
          {error && <div className="error-message">{error}</div>}{" "}
          {/* Afficher l'erreur s'il y en a */}
          <div className="input-container-connexion">
            <input
              type="email"
              placeholder="Votre adresse mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="connexion-btn" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
