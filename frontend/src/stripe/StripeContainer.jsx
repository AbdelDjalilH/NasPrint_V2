import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useAuth } from "../contexts/authContext"; // Importez `useAuth` depuis le contexte

const PUBLIC_KEY =
  "pk_test_51QIAQ1DebYyxPuoB0Pez2iBuzC9OE3HykT8gN0vIM0MxYQmRNVb2CFA9n7qJtuKDfSycFk1M52ub4zvIOEoqHqHu00esBwRCg7";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = ({ totalRising }) => {
  const { user } = useAuth(); // Utilisez `useAuth` pour obtenir les données de l'utilisateur
  const userId = user ? user.id : null; // Vérifiez que `user` est défini avant d'accéder à `user.id`

  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm totalRising={totalRising} userId={userId} />{" "}
      {/* Passez `userId` */}
    </Elements>
  );
};

export default StripeContainer;
