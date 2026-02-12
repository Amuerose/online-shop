import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://amuerose.cz";
const SITE_TITLE = "Amuerose";
const DEFAULT_DESCRIPTION =
  "Amuerose — премиальные ягоды и лакомства в бельгийском шоколаде с доставкой по Праге и Чехии.";
const DEFAULT_IMAGE = "https://amuerose.cz/images/logo.png";

export default function Seo({
  title,
  description,
  canonicalPath,
  noindex = false,
  additionalMeta = [],
}) {
  const location = useLocation();
  const resolvedTitle = title ? `${title} – ${SITE_TITLE}` : SITE_TITLE;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const resolvedPath = canonicalPath ?? location.pathname;
  const canonicalUrl = new URL(resolvedPath, BASE_URL).href;

  const metaEntries = [
    { name: "description", content: resolvedDescription },
    { property: "og:title", content: resolvedTitle },
    { property: "og:description", content: resolvedDescription },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: DEFAULT_IMAGE },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: resolvedTitle },
    { name: "twitter:description", content: resolvedDescription },
    { name: "twitter:image", content: DEFAULT_IMAGE },
    ...additionalMeta,
  ];

  if (noindex) {
    metaEntries.push({ name: "robots", content: "noindex, nofollow" });
  }

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      {metaEntries
        .filter((entry) => entry.content)
        .map((entry, index) => {
          const key = entry.name
            ? `meta-name-${entry.name}-${index}`
            : `meta-prop-${entry.property}-${index}`;
          return <meta key={key} {...entry} />;
        })}
    </Helmet>
  );
}
