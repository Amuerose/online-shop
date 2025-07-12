import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';

function Navbar() {
  const { t, i18n } = useTranslation();
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="w-full bg-white shadow px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Левый блок: языки + меню */}
        <div className="flex items-center gap-8">
          {/* Языки */}
          <div className="flex gap-2">
            <button onClick={() => changeLanguage('cs')}>🇨🇿</button>
            <button onClick={() => changeLanguage('ru')}>🇷🇺</button>
            <button onClick={() => changeLanguage('en')}>🇬🇧</button>
          </div>

          {/* Меню */}
          <nav className="flex gap-6 font-semibold">
            <a href="/">{t('home')}</a>
            <a href="/shop">{t('shop')}</a>
            <a href="/about">{t('about')}</a>
            <a href="/contact">{t('contact')}</a>
          </nav>
        </div>

        {/* Правый блок: корзина */}
        <div className="relative">
          <a href="/cart" className="text-2xl relative">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;