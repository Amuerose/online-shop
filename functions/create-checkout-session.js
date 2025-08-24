// /functions/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { cartItems } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "czk",
          product_data: {
            name: typeof item.name === "object" ? item.name["cs"] : item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: "https://amuerose.cz/success",
      cancel_url: "https://amuerose.cz/cart",
    });

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}