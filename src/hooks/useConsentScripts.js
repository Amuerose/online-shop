

import { useEffect } from "react";

function useConsentScripts() {
  useEffect(() => {
    const consent = JSON.parse(localStorage.getItem("cookie-consent") || "{}");

    // Подключаем GTM только если разрешена аналитика или маркетинг
    if (consent.analytics || consent.marketing) {
      // GTM script
      const script = document.createElement("script");
      script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id=GTM-PSWDX6JC'+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-PSWDX6JC');`;
      document.head.appendChild(script);

      // GTM noscript iframe
      const noscript = document.createElement("noscript");
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PSWDX6JC"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.appendChild(noscript);
    }
  }, []);
}

export default useConsentScripts;