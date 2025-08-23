import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";
import { ShoppingCart, User, Menu, Search } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "/images/logo.png";

function Header() {
  const { cartItems } = useCart();
  const { t } = useTranslation();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest(".mobile-search-toggle")
      ) {
        setMobileSearchOpen(false);
      }
    };

    if (mobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileSearchOpen]);

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".burger-toggle")
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutsideMenu);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, [menuOpen]);

  const navLinks = [
    { path: "/", label: t("home") },
    { path: "/shop", label: t("shop") },
    { path: "/about", label: t("about") },
    { path: "/contact", label: t("contact") },
    { path: "/gallery", label: t("gallery") },
    { path: "/partnership", label: t("partnership") },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center px-[10px] py-4">
      <div className="w-full max-w-[1600px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[22px] border border-white/20 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] rounded-[24px] px-6 py-3 flex flex-col transition-all duration-300">
        {/* Верхняя строка */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 min-w-0">
            <button
              className="burger-toggle xl:hidden text-[#BDA47A]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <nav className="hidden xl:flex gap-1 font-normal text-sm whitespace-nowrap">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1 rounded-full transition-all duration-200 ${
                    location.pathname === link.path
                      ? "bg-white/5 text-[#BDA47A]"
                      : "hover:bg-white/5 text-[#BDA47A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-16 object-contain" />
            </Link>
          </div>

          <div className="flex items-center gap-1.5 justify-end flex-grow max-w-[calc(50%-80px)] min-w-[200px]">
            <div className="hidden md:block flex-grow">
              <GlobalSearch />
            </div>

            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="block md:hidden text-[#BDA47A] mobile-search-toggle"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Сначала User, потом LanguageSwitcher */}
            <Link to="/profile">
              <User className="w-6 h-6 text-[#BDA47A]" />
            </Link>

            <LanguageSwitcher />

            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-[#BDA47A]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Поиск мобилка */}
        {mobileSearchOpen && (
          <div className="w-full mt-3 md:hidden" ref={searchRef}>
            <GlobalSearch isMobile={true} />
          </div>
        )}

        {/* МЕНЮ МОБИЛКА */}
        {menuOpen && (
          <nav
            ref={menuRef}
            className="w-full mt-4 flex flex-col gap-2 font-normal text-sm xl:hidden text-[#BDA47A]"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-xl transition ${
                  location.pathname === link.path
                    ? "bg-white/5 text-[#BDA47A]"
                    : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;