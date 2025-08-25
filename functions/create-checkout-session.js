export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { cartItems } = body;

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "czk",
        product_data: {
          name: typeof item.name === "object" ? item.name["cs"] : item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        mode: "payment",
        success_url: "https://amuerose.cz/success",
        cancel_url: "https://amuerose.cz/cart",
        ...line_items.reduce((acc, item, idx) => {
          acc[`line_items[${idx}][price_data][currency]`] = item.price_data.currency;
          acc[`line_items[${idx}][price_data][product_data][name]`] =
            item.price_data.product_data.name;
          acc[`line_items[${idx}][price_data][unit_amount]`] =
            item.price_data.unit_amount;
          acc[`line_items[${idx}][quantity]`] = item.quantity;
          return acc;
        }, {}),
      }),
    });

    const session = await response.json();

    if (session.error) {
      console.error("❌ Stripe API error:", session.error || session);
      return new Response(JSON.stringify({ error: session.error }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify(session), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("❌ Function crashed:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}