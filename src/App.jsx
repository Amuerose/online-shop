import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
function LocaleRedirect() {
  const location = useLocation();
  const { locale } = useParams();
  const supported = new Set(["ru", "cs", "en"]);
  if (!supported.has(locale || "")) return <Navigate to="/" replace />;
  const nextPath = location.pathname.replace(/^\/(ru|cs|en)(?=\/|$)/, "");
  return <Navigate to={nextPath || "/"} replace />;
}
import { CartProvider } from './contexts/CartContext';
import i18n from './i18n';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import CartPage from './pages/Cart';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Partnership from './pages/Partnership';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const ProductPage = lazy(() => import('./pages/productPage'));
const Register = lazy(() => import('./pages/Register'));
const Gallery = lazy(() => import('./pages/Gallery'));

// UI Components
import Header from './components/Header';
import FloatingInfoPanel from './components/FloatingInfoPanel';

function App() {
  useEffect(() => {
    i18n.changeLanguage('cs');
  }, []);

  return (
    <CartProvider>
      <>
        <Header />
        <Routes>
          <Route path=":locale/*" element={<LocaleRedirect />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<div>Загрузка...</div>}>
                <ProductPage />
              </Suspense>
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={
              <Suspense fallback={<div>Загрузка...</div>}>
                <Register />
              </Suspense>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/gallery"
            element={
              <Suspense fallback={<div>Загрузка...</div>}>
                <Gallery />
              </Suspense>
            }
          />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/data-deletion" element={<div style={{ padding: "2rem", textAlign: "center", color: "#4b3832" }}>
            <h1>Удаление данных Facebook</h1>
            <p>Если вы хотите удалить свои данные, полученные через вход с помощью Facebook,
            пожалуйста, отправьте запрос на наш email: <a href="mailto:support@amuerose.cz">support@amuerose.cz</a>.</p>
            <p>Мы удалим все данные, связанные с вашей учетной записью, в течение 30 дней после получения запроса.</p>
          </div>} />
        </Routes>
        <FloatingInfoPanel />
      </>
    </CartProvider>
  );
}

export default App;