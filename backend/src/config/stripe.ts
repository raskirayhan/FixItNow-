import Stripe from "stripe";

const stripe: InstanceType<typeof Stripe> = new Stripe(
  process.env.STRIPE_SECRET_KEY as string
);

export default stripe;
