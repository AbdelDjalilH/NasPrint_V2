import { useEffect, useState } from "react";
import axios from "axios";
import { useOrder } from "../contexts/OrdersContext"; // Importer le contexte
import StripeContainer from "../stripe/StripeContainer";

export default function PaymentPage() {
  const { orderId } = useOrder(); // Utiliser l'orderId depuis le contexte
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return; // Vérifier que l'orderId existe

    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${orderId}`
        );
        setOrderData(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la commande :", err);
        setError("Impossible de récupérer les détails de la commande.");
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderData) {
    return <div>Chargement...</div>;
  }

  const totalRising = orderData.total_rising;

  return (
    <>
      <h1>Page de Paiement</h1>
      <p>Montant total de la commande : {totalRising} €</p>
      {/* Passer totalRising au composant Stripe */}
      <StripeContainer totalRising={totalRising} />
    </>
  );
}
