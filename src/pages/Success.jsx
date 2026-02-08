import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";
import { blogBackgroundStyle } from "../styles/blogBackground";

function Success() {
  const { clearCart } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart(); // очистка корзины после успешной оплаты
  }, [clearCart]);

  return (
    <div
      className="min-h-[100dvh] px-4 pt-[calc(90px+var(--safe-area-inset-top,0px))] pb-[calc(90px+var(--safe-area-inset-bottom,0px))]"
      style={blogBackgroundStyle}
    >
      <div className="max-w-2xl mx-auto p-6 text-center bg-white/60 backdrop-blur-lg rounded-2xl border border-white/40 text-[#4B2E1D] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-bold mb-4 text-[#BDA47A]">{t("paymentSuccess", "Thank you for your order!")}</h1>
        <p className="text-[#4B2E1D]/80 mb-6">
          {t("paymentSuccessMessage", "We’ve received your payment. Your sweet treats are on the way!")}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#4B2E1D] text-white rounded-full hover:bg-[#3b2316] transition"
        >
          {t("goHome", "Back to Home")}
        </button>
      </div>
    </div>
  );
}

export default Success;
