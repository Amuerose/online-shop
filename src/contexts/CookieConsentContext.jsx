

import React, { createContext, useContext, useState, useEffect } from "react";

const CookieConsentContext = createContext();

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(() => {
    const saved = localStorage.getItem("cookieConsent");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (consent !== null) {
      localStorage.setItem("cookieConsent", JSON.stringify(consent));
    }
  }, [consent]);

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent }}>    
        {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => useContext(CookieConsentContext);