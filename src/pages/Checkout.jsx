import { useCart } from "../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";
import { blogBackgroundStyle } from "../styles/blogBackground";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Checkout() {
  const { cartItems } = useCart();
  const { t, i18n } = useTranslation();

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe is not initialized. Check VITE_STRIPE_PUBLISHABLE_KEY.");
      return;
    }

    // Normalize items for backend
    const sanitizedCartItems = cartItems.map((item) => {
      const rawName = item.name ?? item.title;
      const name =
        typeof rawName === "object"
          ? rawName[i18n.language] || rawName.cs || rawName.en || rawName.ru || "Product"
          : rawName || "Product";
      const price = Number(item.price ?? item.attributes?.price ?? 0);
      return {
        name,
        price,
        quantity: item.quantity || 1,
      };
    });

    const endpoint =
      import.meta.env.VITE_STRIPE_CHECKOUT_URL ||
      "/create-checkout-session";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems: sanitizedCartItems, currency: "czk" }),
    });

    if (!response.ok) {
      console.error("Stripe session error:", await response.text());
      return;
    }

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div
      className="min-h-[100dvh] px-4 pt-[calc(90px+var(--safe-area-inset-top,0px))] pb-[calc(90px+var(--safe-area-inset-bottom,0px))]"
      style={blogBackgroundStyle}
    >
      <div className="max-w-2xl mx-auto p-6 bg-white/60 backdrop-blur-lg rounded-2xl border border-white/40 text-[#4B2E1D] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-bold mb-4 text-[#BDA47A]">{t("checkout", "Checkout")}</h1>
        <ul className="mb-6">
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between py-2 border-b border-white/40">
              <span>
                {typeof item.name === "object"
                  ? item.name[i18n.language] || item.name.en
                  : item.name}
              </span>
              <span>{item.price} Kč × {item.quantity}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-[#4B2E1D] text-white rounded-full hover:bg-[#3b2316] transition"
        >
          {t("payNow", "Pay Now")}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
