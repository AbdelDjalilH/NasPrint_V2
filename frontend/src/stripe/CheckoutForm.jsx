import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/stripe/charge`,
          {
            amount: 1000, // Exemple : 10,00 EUR en centimes
            id: paymentMethod.id,
          }
        );

        if (response.data.success) {
          // Redirection en cas de succès (utilisation de l'URL renvoyée par le backend)
          window.location.href =
            response.data.returnUrl || "http://localhost:5173/payment-complete";
        } else {
          console.log("Le paiement a échoué");
        }
      } catch (error) {
        console.log("Erreur lors du traitement du paiement:", error);
      }
    } else {
      console.log("Erreur dans la création du paiement:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <CardElement options={{ hidePostalCode: true }} />
      <button>Payer</button>
    </form>
  );
};
