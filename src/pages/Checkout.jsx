import { useCart } from "../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe("pk_test_51RfLTZRIGBIYER4yhwF0RIToc5Blz79WTTCoD4LnZu2lYc0TlYiK95DMttbag9359MOsWDghOHY9Bux6B0YBUlUn00rURssqRT");

function Checkout() {
  const { cartItems } = useCart();
  const { t, i18n } = useTranslation();

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    // ✅ Перед отправкой: преобразуем name в строку
    const sanitizedCartItems = cartItems.map((item) => ({
      ...item,
      name:
        typeof item.name === "object"
          ? item.name[i18n.language] || item.name.en
          : item.name,
    }));

    const response = await fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems: sanitizedCartItems }),
    });

    if (!response.ok) {
      console.error("Stripe session error:", await response.text());
      return;
    }

    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="h-[100dvh] max-w-2xl mx-auto p-6 flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-4">{t("checkout", "Checkout")}</h1>
      <ul className="mb-6">
        {cartItems.map((item, index) => (
          <li key={index} className="flex justify-between py-2 border-b">
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
        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
      >
        {t("payNow", "Pay Now")}
      </button>
    </div>
  );
}

export default Checkout;