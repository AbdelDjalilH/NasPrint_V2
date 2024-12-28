import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/checkoutForm.css";

const CheckoutForm = ({ totalRising, userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/create-payment-intent`,
          {
            amount: totalRising * 100,
            user_id: userId,
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Erreur lors de la création du PaymentIntent :", error);
        setErrorMessage(
          "Une erreur est survenue lors de la création du paiement. Veuillez réessayer."
        );
      }
    };

    createPaymentIntent();
  }, [totalRising, userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

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
        setErrorMessage(
          "Le paiement a échoué. Veuillez vérifier vos informations."
        );
      } else {
        console.log("Paiement réussi :", paymentIntent);
        navigate("/payment-complete");
      }
    } catch (err) {
      console.error("Erreur lors de la confirmation du paiement :", err);
      setErrorMessage(
        "Une erreur inattendue s'est produite. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="card-element-container">
        <CardElement
          options={{
            hidePostalCode: true,
            style: cardStyle,
          }}
          className="stripe-card-element"
        />
      </div>

      {errorMessage && (
        <div className="error-message" aria-live="polite">
          {errorMessage}
        </div>
      )}

      <button
        className="payment-btn"
        type="submit"
        disabled={!stripe || !clientSecret || isLoading}
      >
        {isLoading ? "Traitement en cours..." : `Payer ${totalRising} €`}
      </button>
    </form>
  );
};

export default CheckoutForm;
