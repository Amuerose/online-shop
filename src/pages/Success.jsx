import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";

function Success() {
  const { clearCart } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart(); // очистка корзины после успешной оплаты
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto p-6 text-center h-[100dvh] flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-4">{t("paymentSuccess", "Thank you for your order!")}</h1>
      <p className="text-gray-700 mb-6">
        {t("paymentSuccessMessage", "We’ve received your payment. Your sweet treats are on the way!")}
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
      >
        {t("goHome", "Back to Home")}
      </button>
    </div>
  );
}

export default Success;