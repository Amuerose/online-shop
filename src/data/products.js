const products = [
  {
    id: 1,
    name: {
      cs: "Jahody v mléčné čokoládě",
      ru: "Клубника в молочном шоколаде",
      en: "Strawberries in milk chocolate"
    },
    price: 149,
    image: "/images/strawberry-milk.jpg",
    category: "strawberries"
  },
  {
    id: 2,
    name: {
      cs: "Jahody v bílé čokoládě",
      ru: "Клубника в белом шоколаде",
      en: "Strawberries in white chocolate"
    },
    description: {
      ru: "Это не просто клубника. Это клубника, будто бы рожденная в шелке белого шоколада. Представьте себе: нежность, которая тает ещё до того, как вы успели её укусить. Это вкус момента, который хочется прожить медленно. Очень медленно. В каждом фрагменте этого лакомства — внимание, забота и ощущение того, что вы выбрали для себя лучшее. Белый шоколад раскрывает ноты сливок и лёгкой ванили, а ягода добавляет лёгкую кислинку, словно напоминая, что даже в самой сладкой жизни должно быть место балансу. Это не для всех. Это для вас.",
      en: "This is not just a strawberry. It's a strawberry born in the silk of white chocolate. Imagine a tenderness that melts even before you bite. It’s the taste of a moment you want to experience slowly. Very slowly. Every part of this treat holds attention, care, and a sense that you’ve chosen the best for yourself. White chocolate unveils notes of cream and soft vanilla, while the berry brings a hint of tartness — a reminder that even the sweetest lives need balance. This is not for everyone. This is for you.",
      cs: "Tohle není jen jahoda. Je to jahoda, která se narodila v hedvábí bílé čokolády. Představte si jemnost, která se rozpouští ještě před prvním kousnutím. Chuť okamžiku, který chcete prožít pomalu. Velmi pomalu. Každý kousek této pochoutky je naplněn péčí, pozorností a pocitem, že jste si vybrali to nejlepší. Bílá čokoláda odhaluje tóny smetany a jemné vanilky, zatímco jahoda přináší lehkou kyselinku — připomínku, že i v tom nejsladším životě má být rovnováha. Není to pro každého. Je to pro vás."
    },
    price: 149,
    image: "/images/strawberry-white.jpg",
    category: "strawberries"
  },
  {
    id: 3,
    name: {
      cs: "Datle s pistáciemi v mléčné čokoládě",
      ru: "Финики с фисташками в молочном шоколаде",
      en: "Dates with pistachios in milk chocolate"
    },
    price: 129,
    image: "/images/dates-pistachio-milk.jpg",
    category: "dates"
  },
  {
    id: 4,
    name: {
      cs: "Datle s pistáciemi v bílé čokoládě",
      ru: "Финики с фисташками в белом шоколаде",
      en: "Dates with pistachios in white chocolate"
    },
    price: 129,
    image: "/images/dates-pistachio-white.jpg",
    category: "dates"
  },
  {
    id: 5,
    name: {
      cs: "Datle s arašídy v mléčné čokoládě",
      ru: "Финики с арахисом в молочном шоколаде",
      en: "Dates with peanuts in milk chocolate"
    },
    price: 129,
    image: "/images/dates-peanut-milk.jpg",
    category: "dates"
  },
  {
    id: 6,
    name: {
      cs: "Datle s kešu v mléčné čokoládě",
      ru: "Финики с кешью в молочном шоколаде",
      en: "Dates with cashew in milk chocolate"
    },
    price: 129,
    image: "/images/dates-cashew-milk.jpg",
    category: "dates"
  },
  {
    id: 7,
    name: {
      cs: "Datle s lískovým ořechem v mléčné čokoládě",
      ru: "Финики с фундуком в молочном шоколаде",
      en: "Dates with hazelnut in milk chocolate"
    },
    price: 129,
    image: "/images/dates-hazelnut-milk.jpg",
    category: "dates"
  },
  {
    id: 8,
    name: {
      cs: "Datle s vlašským ořechem v mléčné čokoládě",
      ru: "Финики с грецким орехом в молочном шоколаде",
      en: "Dates with walnut in milk chocolate"
    },
    price: 129,
    image: "/images/dates-walnut-milk.jpg",
    category: "dates"
  },
  {
    id: 9,
    name: {
      cs: "Datle s kešu v bílé čokoládě",
      ru: "Финики с кешью в белом шоколаде",
      en: "Dates with cashew in white chocolate"
    },
    price: 129,
    image: "/images/dates-cashew-white.jpg",
    category: "dates"
  },
  {
    id: 10,
    name: {
      cs: "Datle s lískovým ořechem v bílé čokoládě",
      ru: "Финики с фундуком в белом шоколаде",
      en: "Dates with hazelnut in white chocolate"
    },
    price: 129,
    image: "/images/dates-hazelnut-white.jpg",
    category: "dates"
  },
  {
    id: 11,
    name: {
      cs: "Datle s arašídy v bílé čokoládě",
      ru: "Финики с арахисом в белом шоколаде",
      en: "Dates with peanuts in white chocolate"
    },
    price: 129,
    image: "/images/dates-peanut-white.jpg",
    category: "dates"
  },
  {
    id: 16,
    name: {
      cs: "Maliny v mléčné čokoládě ve kelímku",
      ru: "Малина в молочном шоколаде в стаканчике",
      en: "Raspberries in milk chocolate (cup)"
    },
    price: 99,
    image: "/images/raspberries-milk-cup.jpg",
    category: "raspberries"
  },
  {
    id: 17,
    name: {
      cs: "Maliny v bílé čokoládě ve kelímku",
      ru: "Малина в белом шоколаде в стаканчике",
      en: "Raspberries in white chocolate (cup)"
    },
    price: 99,
    image: "/images/raspberries-white-cup.jpg",
    category: "raspberries"
  },
  {
    id: 18,
    name: {
      cs: "Borůvky v bílé čokoládě ve kelímku",
      ru: "Черника в белом шоколаде в стаканчике",
      en: "Blueberries in white chocolate (cup)"
    },
    price: 99,
    image: "/images/blueberries-white-cup.jpg",
    category: "blueberries"
  },
  {
    id: 19,
    name: {
      cs: "Borůvky v mléčné čokoládě ve kelímku",
      ru: "Черника в молочном шоколаде в стаканчике",
      en: "Blueberries in milk chocolate (cup)"
    },
    price: 99,
    image: "/images/blueberries-milk-cup.jpg",
    category: "blueberries"
  },
  {
    id: 20,
    name: {
      cs: "Třešně v mléčné čokoládě ve kelímku",
      ru: "Вишня в молочном шоколаде в стаканчике",
      en: "Cherries in milk chocolate (cup)"
    },
    price: 99,
    image: "/images/cherries-milk-cup.jpg",
    category: "cherries"
  },
  {
    id: 21,
    name: {
      cs: "Třešně v bílé čokoládě ve kelímku",
      ru: "Вишня в белом шоколаде в стаканчике",
      en: "Cherries in white chocolate (cup)"
    },
    price: 99,
    image: "/images/cherries-white-cup.jpg",
    category: "cherries"
  },
  {
    id: 22,
    name: {
      cs: "Banány v bílé čokoládě",
      ru: "Бананы в белом шоколаде",
      en: "Bananas in white chocolate"
    },
    price: 139,
    image: "/images/banana-white.jpg",
    category: "bananas"
  },
  {
    id: 23,
    name: {
      cs: "Banány v mléčné čokoládě",
      ru: "Бананы в молочном шоколаде",
      en: "Bananas in milk chocolate"
    },
    price: 139,
    image: "/images/banana-milk.jpg",
    category: "bananas"
  }
];

export default products;

/**
 * Returns products with localized fields pre-resolved.
 * @param {('cs'|'ru'|'en')} locale
 */
export function getProducts(locale = 'cs') {
  return products.map((p) => ({
    ...p,
    name: typeof p.name === 'object' ? (p.name?.[locale] ?? p.name?.en ?? '') : p.name,
    description:
      typeof p.description === 'object'
        ? (p.description?.[locale] ?? p.description?.en ?? '')
        : (p.description ?? ''),
  }));
}

/**
 * Find a single product by id with localization.
 * @param {number|string} id
 * @param {('cs'|'ru'|'en')} locale
 */
export function findProductById(id, locale = 'cs') {
  const p = products.find((x) => String(x.id) === String(id));
  if (!p) return null;
  return {
    ...p,
    name: typeof p.name === 'object' ? (p.name?.[locale] ?? p.name?.en ?? '') : p.name,
    description:
      typeof p.description === 'object'
        ? (p.description?.[locale] ?? p.description?.en ?? '')
        : (p.description ?? ''),
  };
}

/**
 * Filter by category with localization.
 * @param {string} category
 * @param {('cs'|'ru'|'en')} locale
 */
export function getProductsByCategory(category, locale = 'cs') {
  return getProducts(locale).filter((p) => p.category === category);
}