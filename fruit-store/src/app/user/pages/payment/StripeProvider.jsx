import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
    "pk_test_51SmXiZLfNRTA8GOHRQDo79seWVSR1YwbFXAljvU13ne2hi9VyOIzhL20pJ9TwE7ZiL8bhJ3gr7OrWer9cEJDXaUO00mkheWlbr"
);

export default function StripeProvider({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
