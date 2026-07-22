import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe features will be unavailable.");
}

const stripe: InstanceType<typeof Stripe> = new Stripe(
  stripeKey || "sk_placeholder"
);

export default stripe;
