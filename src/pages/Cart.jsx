import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
const DatePicker = lazy(() => import("react-datepicker"));
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

function Cart() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  // equalize time picker height to calendar
  const calendarRef = useRef(null);
  const timeRef = useRef(null);
  // рабочие часы и отложенный минимум
  const now = new Date();
  const offset = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);
  const workStart = new Date();
  workStart.setHours(10, 0, 0, 0);
  const workEnd = new Date();
  workEnd.setHours(22, 0, 0, 0);
  // Generate only allowed times for time picker
  const timeIntervals = 30;
  const includeTimes = [];
  // Determine start time aligned to interval
  const startTime = offset > workStart
    ? new Date(Math.ceil(offset.getTime() / (timeIntervals * 60 * 1000)) * timeIntervals * 60 * 1000)
    : new Date(workStart);
  for (
    let t = new Date(startTime);
    t <= workEnd;
    t = new Date(t.getTime() + timeIntervals * 60 * 1000)
  ) {
    includeTimes.push(new Date(t));
  }

  useEffect(() => {
    if (calendarRef.current && timeRef.current) {
      const h = calendarRef.current.getBoundingClientRect().height;
      timeRef.current.style.height = `${h}px`;
    }
  });
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState("cart"); // cart -> details
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
    deliveryTime: "",
    deliveryMethod: "courier",
    asap: false,
  });
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  // Removed showCalendar state, calendar is always shown now
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleStripeCheckout = async () => {
    try {
      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

      // Normalize items to a clean, backend‑friendly shape
      const items = cartItems.map((item) => {
        const name =
          typeof item.name === "object"
            ? item.name[i18n.language] ||
              item.name.cs ||
              item.name.en ||
              item.name.ru ||
              "Product"
            : item.name;

        // Try flat price first, then nested price (for legacy objects)
        const price =
          Number(item.price ?? item.attributes?.price ?? 0);

        // Try several common places where an image may live
        const image =
          item.image ||
          item.coverUrl ||
          (item.attributes?.images &&
            (Array.isArray(item.attributes.images)
              ? item.attributes.images[0]?.url
              : item.attributes.images?.data?.[0]?.attributes?.url)) ||
          null;

        return {
          name,
          price,
          quantity: item.quantity || 1,
          image,
        };
      });

      const customerData = { ...form }; // capture delivery form

      // Resolve checkout endpoint:
      // 1) VITE_STRIPE_CHECKOUT_URL (recommended, full https URL),
      // 2) fallback to Pages Function path: /api/create-checkout-session
      const endpoint =
        import.meta.env.VITE_STRIPE_CHECKOUT_URL ||
        "/api/create-checkout-session";

      console.log("🚀 Sending request to create-checkout-session with items:", items);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // currency is important for correct amounts on backend
        body: JSON.stringify({
          items,
          customer: customerData,
          currency: "czk",
        }),
      });

      if (!response.ok) {
        const txt = await response.text().catch(() => "");
        console.error("❌ Checkout endpoint responded with", response.status, txt);
        return;
      }

      const session = await response.json();
      console.log("✅ Session created:", {
        id: session.id,
        mode: session.mode,
        url: session.url,
      });

      if (!session.id) {
        console.error("❌ No session ID in response");
        return;
      }

      console.log("📦 Redirecting to checkout with session ID:", session.id);
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error("💥 Stripe redirect error:", result.error.message);
      }
    } catch (error) {
      console.error("💣 Unexpected error during checkout:", error);
    }
  };

  // Auto-populate address and phone from user on details step
  useEffect(() => {
    if (step === "details" && user) {
      setForm(f => ({
        ...f,
        address: user.address || "",
        phone: user.phone   || "",
      }));
    }
  }, [step, user]);

  if (step === "details") {
    const detailsTotal = total + (form.deliveryMethod === "courier" ? 200 : 0);
    return (
      <div
        className="relative h-[100dvh] overflow-hidden pt-[55px] px-2 pb-[calc(90px+var(--safe-area-inset-bottom,0px))] sm:pt-[90px] sm:px-4 sm:pb-[calc(160px+var(--safe-area-inset-bottom,0px))]"
        style={{
          background: [
            'linear-gradient(120deg, #F7F0E8 0%, #EDE3D4 50%, #E4D8C6 100%)',
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 70%)',
            'radial-gradient(circle at 80% 80%, rgba(189,164,122,0.2) 0%, transparent 60%)'
          ].join(', '),
        }}
      >
        <div className="w-full max-w-6xl mx-auto mt-[20px] mb-[80px] grid grid-cols-1 lg:grid-cols-2 gap-6 px-2">
        {/* Form panel */}
        <div className="text-sm sm:text-base bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] rounded-[24px] px-6 py-3 overflow-y-auto max-h-[calc(100dvh-140px)]">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold mb-6 text-center font-[Inter] text-[#BDA47A]">
            {t("deliveryDetails", { defaultValue: "Delivery details" })}
          </h1>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await handleStripeCheckout();
            }}
            className="space-y-4 sm:space-y-5"
          >
            {/* Full name */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-[#BDA47A]">
                {t("name", { defaultValue: "Full name" })}
              </label>
              <input
                type="text"
                name="name"
                value={form["name"]}
                onChange={handleChange}
                required
                className="w-full border border-[#BDA47A]/20 bg-white/10 backdrop-blur-lg p-1 sm:p-2 rounded-xl placeholder:text-[#bfa87e] text-[#4B2E1D] shadow-inner text-base"
              />
            </div>
            {/* Email and Phone in one row */}
            <div className="flex gap-4">
              {[
                { name: "email", type: "email", label: "E‑mail" },
                { name: "phone", type: "text", label: "Phone" },
              ].map((field) => (
                <div key={field.name} className="w-1/2 space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-[#BDA47A]">
                    {t(field.name, { defaultValue: field.label })}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#BDA47A]/20 bg-white/10 backdrop-blur-lg p-1 sm:p-2 rounded-xl placeholder:text-[#bfa87e] text-[#4B2E1D] shadow-inner text-base"
                  />
                </div>
              ))}
            </div>
            {/* Address */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-[#BDA47A]">
                {t("address", { defaultValue: "Address" })}
              </label>
              <input
                type="text"
                name="address"
                value={form["address"]}
                onChange={handleChange}
                required
                className="w-full border border-[#BDA47A]/20 bg-white/10 backdrop-blur-lg p-1 sm:p-2 rounded-xl placeholder:text-[#bfa87e] text-[#4B2E1D] shadow-inner text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#4B2E1D] font-medium">
                <span className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="asap"
                    checked={form.asap}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        asap: e.target.checked,
                        deliveryDate: "",
                        deliveryTime: "",
                      }))
                    }
                    className="appearance-none w-5 h-5 rounded border border-[#BDA47A] bg-white/20 backdrop-blur-sm checked:bg-white checked:border-[#BDA47A] transition"
                  />
                  {form.asap && (
                    <svg
                      className="absolute left-0 top-0 w-6 h-6 text-[#4B2E1D] -translate-x-[2px] -translate-y-[2px] pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="5 13 9 17 19 7" />
                    </svg>
                  )}
                </span>
                {t("asap", { defaultValue: "As soon as possible (within 3 hours)" })}
              </label>
            </div>
            {!form.asap && (
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-[#BDA47A]">
                  {t("selectDate", { defaultValue: "Select a date" })}
                </label>
                <div className="flex flex-row gap-4 justify-center items-start">
                <div ref={calendarRef}>
                  <Suspense fallback={null}>
                    <DatePicker
                      selected={form.deliveryDate ? new Date(form.deliveryDate) : null}
                      onChange={(date) =>
                        setForm({ ...form, deliveryDate: date.toISOString().split("T")[0] })
                      }
                      dateFormat="dd.MM.yyyy"
                      minDate={offset}
                      inline
                      calendarClassName="!bg-transparent !text-[#4B2E1D]"
                    />
                  </Suspense>
                </div>
                <div ref={timeRef}>
                  <Suspense fallback={null}>
                    <DatePicker
                      selected={form.deliveryTime ? new Date(`2000-01-01T${form.deliveryTime}`) : null}
                      onChange={(date) =>
                        setForm({ ...form, deliveryTime: date.toTimeString().slice(0, 5) })
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption={t("time", { defaultValue: "Time" })}
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      filterTime={(time) => {
                        // Determine if the selected delivery date is today
                        const selected = form.deliveryDate;
                        const todayStr = new Date().toISOString().split("T")[0];
                        // If selecting today, enforce offset; otherwise, allow full work hours
                        const startTime = selected === todayStr
                          ? (offset > workStart ? offset : workStart)
                          : workStart;
                        return time >= startTime && time <= workEnd;
                      }}
                      inline
                      calendarClassName="!bg-transparent !text-[#4B2E1D] [&_.react-datepicker__header]:!bg-transparent [&_.react-datepicker__time-container]:!bg-transparent [&_.react-datepicker__time]:!bg-transparent [&_.react-datepicker__time-box]:!bg-transparent [&_.react-datepicker__time-list]:!bg-transparent [&_.react-datepicker__time-list-item]:!bg-transparent !text-[#4B2E1D] [&_.react-datepicker__time-list-item--selected]:!bg-[#BDA47A]/30 [&_.react-datepicker__time-list-item:hover]:!bg-[#BDA47A]/20"
                    />
                  </Suspense>
                </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-[#BDA47A]">{t("deliveryMethod", { defaultValue: "Delivery method" })}</label>
              <div className="flex items-center gap-6 mt-4">
                {[
                  { value: "courier", label: t("courier", { defaultValue: "Courier" }) },
                  { value: "pickup", label: t("pickup", { defaultValue: "Pickup" }) },
                ].map(({ value, label }) => (
                  <label key={value} className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#4B2E1D] font-medium">
                    <span className="relative flex items-center">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={value}
                        checked={form.deliveryMethod === value}
                        onChange={handleChange}
                        className="appearance-none w-5 h-5 rounded-full border border-[#BDA47A] bg-white/20 backdrop-blur-sm checked:bg-white checked:border-[#BDA47A] transition"
                      />
                      {form.deliveryMethod === value && (
                        <svg
                          className="absolute left-0 top-0 w-6 h-6 text-black -translate-x-[2px] -translate-y-[2px] pointer-events-none"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="5 13 9 17 19 7" />
                        </svg>
                      )}
                    </span>
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 text-right text-lg font-semibold text-[#BDA47A]">
              {t("total", { defaultValue: "Total" })}: {total} Kč
            </div>

            <div className="text-right font-semibold text-[#BDA47A] mb-4">
              {t("totalWithShipping", { defaultValue: "Total including shipping" })}: {detailsTotal} Kč
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-white/20 bg-white/20 backdrop-blur font-semibold transition hover:bg-white/30 text-[#4B2E1D] shadow"
              >
                {t("backToCart", { defaultValue: "Back to cart" })}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full border border-white/20 bg-white/20 backdrop-blur font-semibold transition hover:bg-white/30 text-[#4B2E1D] shadow"
              >
                {t("goToPayment", { defaultValue: "Перейти к оплате" })}
              </button>
            </div>
            <div className="mt-4 lg:hidden text-center">
              <button
                type="button"
                onClick={() => setShowMobileInfo(!showMobileInfo)}
                className="underline text-[#BDA47A] font-medium"
              >
                {t("deliveryInfoTitle", { defaultValue: "Delivery information" })}
              </button>
            </div>
          </form>
        </div>
   {/* Info panel */}
<div className="hidden lg:block w-full max-w-lg bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] rounded-[24px] px-6 py-3 self-start">
  <div>
    <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 text-[#BDA47A]">
      {t("deliveryInfoTitle", { defaultValue: "Delivery information" })}
    </h2>
    <p className="text-[#4B2E1D]">
      {t("deliveryInfoCourier", { defaultValue: "Doručení kurýrem v Praze stojí 200 Kč." })}
    </p>
    <p className="text-[#4B2E1D]">
      {t("deliveryInfoPickup", { defaultValue: "Osobní odběr zdarma – Ve Střešovičkách 445/53, Praha 6" })}
    </p>
    <p className="mt-2 text-[#4B2E1D]">
      {t("outsideWorkingHours", { defaultValue: "Při objednávce mimo pracovní dobu nás prosím" })}{" "}
      <Link to="/contact" className="underline text-[#4B2E1D]">
        kontaktujte
      </Link>.
    </p>
  </div>
  <div className="p-4 bg-white/10 border border-white/10 rounded-xl backdrop-blur mt-6 text-sm text-[#4B2E1D]">
    {t("deliveryInfo", {
      defaultValue: "We will deliver your order within 2 hours. You will be contacted by phone.",
    })}
  </div>
</div>
      </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-[100dvh] overflow-hidden pt-[90px] px-4 pb-[calc(90px+var(--safe-area-inset-bottom,0px))] sm:pb-[calc(160px+var(--safe-area-inset-bottom,0px))]"
      style={{
        background: [
          'linear-gradient(120deg, #F7F0E8 0%, #EDE3D4 50%, #E4D8C6 100%)',
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 70%)',
          'radial-gradient(circle at 80% 80%, rgba(189,164,122,0.2) 0%, transparent 60%)'
        ].join(', '),
      }}
    >
      <div className="relative max-w-4xl w-full mx-auto bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] rounded-[24px] px-6 py-3 h-[calc(100dvh-180px+var(--safe-area-inset-bottom,0px))] grid grid-rows-[1fr_auto]">
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="absolute top-6 sm:top-8 right-4 w-fit px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 font-semibold text-[#4B2E1D] transition hover:bg-[rgba(255,255,255,0.1)]"
          >
            <Trash2 className="w-6 h-6 text-[#BDA47A]" aria-label={t("clearCart", { defaultValue: "Clear Cart" })} />
          </button>
        )}
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold mb-6 sm:mb-10 text-center font-[Inter] text-[#BDA47A] drop-shadow">
          {t("yourCart", { defaultValue: "Your cart" })}
        </h1>
        <div className="overflow-y-auto max-h-[calc(100dvh-358px+var(--safe-area-inset-bottom,0px))] custom-scroll pr-1 [mask-image:linear-gradient(to_bottom,transparent,black_2%,black_98%,transparent)] [mask-size:100%_100%] [mask-repeat:no-repeat]">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">
              {t("cartEmpty", { defaultValue: "Your cart is empty." })}
            </p>
          ) : (
            <ul className="space-y-3">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="relative flex items-center gap-4 px-4 py-3 bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                >
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                    <img
                      src={
                        // Prefer normalized field coming from add-to-cart, then fall back to legacy attribute paths
                        item.image
                        || (Array.isArray(item.attributes?.images) ? item.attributes.images[0]?.url : null)
                        || item.attributes?.images?.data?.[0]?.attributes?.url
                        || "/placeholder.png"
                      }
                      alt={
                        // Localized name from normalized shape first
                        (typeof item.name === "object"
                          ? (item.name[i18n.language] || item.name.cs || item.name.en || item.name.ru)
                          : item.name)
                        || (item.attributes?.name?.[i18n.language] || item.attributes?.name?.en)
                        || "Product image"
                      }
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="pr-8">
                    <h2 className="text-sm sm:text-base font-semibold font-[Inter] leading-tight break-words text-[#4B2E1D]">
                      {(typeof item.name === "object"
                        ? (item.name[i18n.language] || item.name.cs || item.name.en || item.name.ru)
                        : item.name)
                        || (item.attributes?.name?.[i18n.language] || item.attributes?.name?.en)
                        || "Product"}
                    </h2>
                    <p className="text-[11px] font-medium font-[Inter] text-[#4B2E1D]">
                      {((item.price ?? item.attributes?.price ?? 0) * (item.quantity || 1))} Kč
                    </p>
                  </div>
                    <button
                      onClick={() => removeFromCart(item)}
                      className="absolute top-2 right-2 hover:scale-110 transition"
                      aria-label="Удалить товар"
                    >
                      <Trash2 className="w-5 h-5 text-[#BDA47A]" aria-label={t("removeItem", { defaultValue: "Remove item" })} />
                    </button>

                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) updateQuantity(item, item.quantity - 1);
                        }}
                        className="w-5 h-5 rounded-full text-[#BDA47A] text-[10px] font-bold font-[Inter]"
                      >
                        −
                      </button>
                      <span className="text-xs text-[#BDA47A] font-medium font-[Inter]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        className="w-5 h-5 rounded-full text-[#BDA47A] text-[10px] font-bold font-[Inter]"
                      >
                        +
                      </button>
                    </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 mt-4 sm:gap-4 sm:mt-6 font-[Inter] text-sm sm:text-base text-center">
          <div className="text-[#BDA47A] font-semibold text-center sm:text-left">
            {t("total", { defaultValue: "Total" })}: {total} Kč
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => setStep("details")}
              className="min-w-[160px] px-4 py-1.5 sm:px-6 sm:py-2 rounded-full bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 font-semibold text-[#4B2E1D] transition hover:bg-[rgba(255,255,255,0.1)]"
            >
              {t("selectDelivery", { defaultValue: "Select delivery method" })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;