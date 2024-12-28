import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useAuth } from "../contexts/AuthContext";

const PUBLIC_KEY =
  "pk_test_51QIAQ1DebYyxPuoB0Pez2iBuzC9OE3HykT8gN0vIM0MxYQmRNVb2CFA9n7qJtuKDfSycFk1M52ub4zvIOEoqHqHu00esBwRCg7";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = ({ totalRising }) => {
  const { user } = useAuth();
  const userId = user ? user.id : null;

  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm totalRising={totalRising} userId={userId} />{" "}
    </Elements>
  );
};

export default StripeContainer;
