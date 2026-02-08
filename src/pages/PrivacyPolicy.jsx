import React from "react";
import { blogBackgroundStyle } from "../styles/blogBackground";

export default function PrivacyPolicyPage() {

  return (
    <div
      className="relative h-screen pt-[90px] px-4 pb-[calc(90px+var(--safe-area-inset-bottom,0px))] sm:pb-[calc(160px+var(--safe-area-inset-bottom,0px))] overflow-hidden"
      style={blogBackgroundStyle}
    >
      <div className="w-full max-w-[1000px] mx-auto bg-white/60 backdrop-blur-[22px] border border-white/40 rounded-[24px] shadow-[inset_0_0_0.5px_rgba(255,255,255,0.4),0_4px_20px_rgba(0,0,0,0.3)] px-6 py-8 text-[#4B2E1D] h-full overflow-y-auto">
        <h1 className="text-2xl font-bold text-center text-[#BDA47A] mb-6">
          Zásady ochrany osobních údajů
        </h1>
        <p>
          <strong>Správce osobních údajů</strong><br />
          David Oganesyan, IČO 10734562<br />
          Ve Střešovičkách 445/53, 169 00 Praha 6<br />
          E-mail: <a href="mailto:info.amuerose@gmail.com">info.amuerose@gmail.com</a>
        </p>

        <hr />

        <h2 className="text-xl font-semibold mt-6 mb-4">PODMÍNKY OCHRANY OSOBNÍCH ÚDAJŮ</h2>

        <h3 className="text-lg font-semibold mt-6 mb-2">1. Základní informace</h3>
        <p className="mb-4">
          Jsme společnost provozující online-shop na adrese amuerose.cz. Veškeré dotazy či žádosti o uplatnění práv týkajících se osobních údajů zasílejte na výše uvedený e-mail nebo přes kontaktní formulář v sekci „Kontakt“.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">2. Jaké osobní údaje shromažďujeme</h3>
        <p className="mb-2"><strong>1. Údaje, které nám poskytujete přímo:</strong></p>
        <ul className="list-disc list-inside mb-4">
          <li>Při registraci a správě profilu: jméno, příjmení, e-mail, heslo (uložené jako hash), volitelně telefonní číslo.</li>
          <li>Při přihlášení přes Google/Facebook: e-mail, jméno, profilová fotografie (v rozsahu Vámi uděleného souhlasu).</li>
          <li>Při objednávce: fakturační a doručovací adresa.</li>
        </ul>
        <p className="mb-2"><strong>2. Údaje získané automaticky:</strong></p>
        <ul className="list-disc list-inside mb-4">
          <li>IP adresa, typ prohlížeče, operační systém, datum a čas přístupu.</li>
          <li>Kliknuté odkazy, doba strávená na stránkách a další údaje pro zlepšení uživatelského zážitku.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">3. Právní základy zpracování</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Plnění smlouvy: zpracování údajů nezbytných pro dokončení a doručení Vaší objednávky.</li>
          <li>Souhlas: marketingová komunikace (newsletter, e-maily), cookies nad rámec nezbytných.</li>
          <li>Oprávněný zájem: statistická analýza návštěvnosti (Google Analytics), zabezpečení webu, prevence podvodů.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">4. Cookies a jiné sledovací technologie</h3>
        <ul className="list-decimal list-inside mb-4">
          <li><strong>Nezbytné cookies (nelze vypnout)</strong><br />
              Zajišťují základní funkce webu: přihlášení, nákupní košík, bezpečnostní prvky.</li>
          <li><strong>Analytické cookies (Google Analytics)</strong><br />
              Anonymizovaná data o návštěvnosti a chování uživatelů pro zlepšení webu.<br />
              Více informací: <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer">Zásady ochrany osobních údajů Google Analytics</a></li>
          <li><strong>Reklamní cookies a další sledování</strong><br />
              Pro personalizovanou reklamu a cílené nabídky.<br />
              Vypnout je můžete v nastavení soukromí Vašeho prohlížeče.</li>
        </ul>
        <p className="italic mb-4">
          Všechny cookies starší 30 dní jsou anonymizovány nebo mazány v souladu s GDPR a českou vyhláškou č. 359/2014 Sb.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">5. Předávání údajů třetím stranám</h3>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Dopravci</strong><br />
              Pro doručení zboží předáváme jméno, adresu a telefonní číslo.</li>
          <li><strong>Platební brána (Adyen)</strong><br />
              Platební údaje (kartová data) jsou spravována výhradně poskytovatelem. My máme uložen pouze neúplné údaje (první a poslední čtyři číslice karty), pokud si je uložíte pro rychlejší budoucí platby.</li>
          <li><strong>Přihlášení přes Google/Facebook</strong><br />
              Zpracováváme jen ty údaje, které nám udělíte při autorizaci.<br />
              Podrobné zásady Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Zásady ochrany osobních údajů Google</a><br />
              Podrobné zásady Facebooku: <a href="https://www.facebook.com/policy.php" target="_blank" rel="noopener noreferrer">Zásady ochrany osobních údajů Facebooku</a></li>
          <li><strong>Google Analytics</strong><br />
              Provádí shromažďování a zpracování anonymizovaných statistik návštěvnosti.</li>
          <li><strong>Marketingové nástroje (např. Mailchimp)</strong><br />
              E-mailové adresy pro rozesílku newsletteru zpracováváme pouze se souhlasem.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">6. Doba uchování</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Objednávky a faktury: minimálně 10 let (daňové předpisy).</li>
          <li>Údaje v uživatelském profilu: po dobu existence účtu + 5 let poté.</li>
          <li>Souhlasy k marketingu: až 7 let nebo do odvolání souhlasu.</li>
          <li>Cookie data (Google Analytics): detailní do 30 dní, anonymizovaná data trvale.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">7. Zabezpečení osobních údajů</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Veškerá komunikace je šifrována protokolem HTTPS/TLS.</li>
          <li>Hesla ukládáme pouze jako BCRYPT hash (cost factor 12).</li>
          <li>Přístup k databázím je přísně kontrolován a logován, provádíme pravidelné bezpečnostní audity.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">8. Práva subjektů údajů</h3>
        <p className="mb-2">Máte právo kdykoliv:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Požádat o přístup k Vašim osobním údajům.</li>
          <li>Opravit či doplnit nesprávné údaje.</li>
          <li>Požádat o výmaz („právo být zapomenut“).</li>
          <li>Požádat o omezení zpracování.</li>
          <li>Vznést námitku proti zpracování.</li>
          <li>Odvolat souhlas se zpracováním (nezmění to zákonné zpracování před odvoláním).</li>
        </ul>
        <p className="mb-4"><strong>Jak uplatnit svá práva:</strong></p>
        <ul className="list-disc list-inside mb-4">
          <li>Přihlaste se do „Mého účtu“ → Nastavení účtu → Osobní údaje.</li>
          <li>Nebo nám napište na <a href="mailto:privacy@amuerose.cz">privacy@amuerose.cz</a>.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 mb-2">9. Osoby mladší 16 let</h3>
        <p className="mb-4">
          Web není určen pro osoby mladší 16 let. Registrace je možná pouze se souhlasem zákonného zástupce.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2">10. Změny zásad</h3>
        <p className="mb-4">
          Tato politika je platná od 12. 7. 2025. Vyhrazujeme si právo ji kdykoliv aktualizovat; aktuální verze je vždy na této stránce.
        </p>
      </div>
    </div>
  );
}
