import { useState, useEffect } from "react";
import "../styles/connexion.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/client-info");
      e;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Erreur de connexion, veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token trouvé dans le localStorage :", token);
    }
  }, []);

  return (
    <div>
      <section className="connexion-section">
        <form onSubmit={handleLogin} className="connexion-form">
          <h1 className="connexion-title">Connectez-vous!</h1>
          {error && <div className="error-message">{error}</div>}{" "}
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
