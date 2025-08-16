import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
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
        <Suspense fallback={<div>Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/partnership" element={<Partnership />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </Suspense>
        <FloatingInfoPanel />
      </>
    </CartProvider>
  );
}

export default App;