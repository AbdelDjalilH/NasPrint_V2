import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/checkoutForm.css"; // Assurez-vous d'avoir un fichier CSS pour styliser le formulaire

const CheckoutForm = ({ totalRising, userId }) => {
  // Ajoutez `userId` comme prop
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/create-payment-intent`,
          {
            amount: totalRising * 100, // Montant en centimes
            user_id: userId, // Ajoutez `user_id` ici
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Erreur lors de la création du PaymentIntent :", error);
      }
    };

    createPaymentIntent();
  }, [totalRising, userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        console.error("Erreur de paiement :", error);
      } else {
        console.log("Paiement réussi :", paymentIntent);
        navigate("/payment-complete");
      }
    } catch (err) {
      console.error("Erreur lors de la confirmation du paiement :", err);
    }
  };

  // Options de style pour le CardElement
  const cardStyle = {
    style: {
      base: {
        color: "#303238",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card-element-container">
        <CardElement
          options={{
            hidePostalCode: true,
            style: cardStyle,
          }}
          className="stripe-card-element"
        />
      </div>
      <button
        className="payment-btn"
        type="submit"
        disabled={!stripe || !clientSecret}
      >
        Payer {totalRising} €
      </button>
    </form>
  );
};

export default CheckoutForm;
