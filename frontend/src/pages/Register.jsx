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

    try {
      const response = await axios.post(
        `http://localhost:3335/auth/register`,
        formDatas
      ); // Mettez ici l'URL correcte de votre backend

      console.info("Données reçues du backend :", response.data);

      const newUser = {
        username: formDatas.username,
        email: formDatas.email,
        password: formDatas.password,
      };

      // login(newUser);
      navigate(`/connexion`);
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <section className="register-section">
        <form className="register-form" onSubmit={handleSubmit}>
          <h1 className="register-title">Pas inscrit? Inscrivez-vous!</h1>
          <div className="input-container">
            <input
              type="text"
              id="username"
              name="username"
              value={formDatas.username} // Ajout de value pour rendre cet input contrôlé
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
