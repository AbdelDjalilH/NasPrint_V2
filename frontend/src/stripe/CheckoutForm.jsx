import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = ({ totalRising }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.createPaymentIntent({
        amount: totalRising * 100, // Montant en centimes
        currency: "eur",
        payment_method: {
          card: elements.getElement(CardElement),
        },
        confirm: true,
      });

      if (error) {
        console.error("Erreur de paiement :", error);
      } else {
        console.log("Paiement réussi :", paymentIntent);
      }
    } catch (err) {
      console.error("Erreur lors de la création du paiement :", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe}>
        Payer {totalRising} €
      </button>
    </form>
  );
};

export default CheckoutForm;
