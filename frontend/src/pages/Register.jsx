import "../styles/register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [formDatas, setFormDatas] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      console.log("Données envoyées au backend :", formDatas);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formDatas
      );

      if (response.status === 200 || response.status === 201) {
        console.info("Données reçues du backend :", response.data);

        navigate(`/verification-otp`, {
          state: { ...formDatas },
        });
      } else {
        console.error("Erreur lors de l'inscription :", response);
        setErrorMessage(response.data?.message || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement :",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Une erreur interne s'est produite."
      );
    }
  };

  return (
    <div>
      <section className="register-section">
        <form className="register-form" onSubmit={handleSubmit}>
          <h1 className="register-title">Pas inscrit? Inscrivez-vous!</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="input-container">
            <input
              type="text"
              id="username"
              name="username"
              value={formDatas.username}
              onChange={handleChange}
              placeholder="Votre nom d'utilisateur"
              required
            />
            <input
              type="email"
              id="typeEmailX"
              name="email"
              value={formDatas.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              id="typePasswordX"
              name="password"
              value={formDatas.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="connexion-button">
              S'inscrire
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
