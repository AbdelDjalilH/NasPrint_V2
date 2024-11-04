import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function PaymentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log(
        "Utilisateur non connecté, redirection vers la page d'accueil."
      );
      navigate("/"); // Redirection vers la page d'accueil si non connecté
    }
  }, [user, navigate]); // Assurez-vous d'ajouter navigate comme dépendance

  return (
    <>
      <h1>lololo</h1>
    </>
  );
}
