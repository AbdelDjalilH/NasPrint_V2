import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClientInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [numberRoad, setNumberRoad] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      console.log(
        "Utilisateur non connecté, redirection vers la page d'accueil."
      );
      navigate("/"); // Redirection vers la page d'accueil si non connecté
    }
  }, [user, navigate]); // Assurez-vous d'ajouter navigate comme dépendance

  const addInformations = async () => {
    if (!user) {
      console.error("Erreur : l'utilisateur n'est pas défini");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/adresses`,
        {
          lastname: lastName,
          firstname: firstName,
          number_road: numberRoad,
          city,
          postal_code: postalCode,
          user_id: user.id,
        },
        { withCredentials: true }
      );
      console.log("Informations enregistrées :", response.data);

      // Redirection après succès de l'enregistrement
      navigate("/"); // Rediriger vers la page d'accueil ou une autre page de votre choix
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des informations :",
        error
      );
    }
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Bonjour, {user.email}!</h1>
          <h2>Veuillez renseigner les informations suivantes</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addInformations();
            }}
          >
            <input
              type="text"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Votre adresse de livraison en entier"
              value={numberRoad}
              onChange={(e) => setNumberRoad(e.target.value)}
            />
            <input
              type="text"
              placeholder="Votre ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Votre code postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <button type="submit">Enregistrer</button>
          </form>
        </>
      ) : (
        <p>{errorMessage}</p>
      )}
    </div>
  );
};

export default ClientInfo;
