// src/data/catalog.js
// Single source of truth for all products (no backend, no categories)

export const catalogProducts = [
  {
    id: 'lyo-raspberry-white',
    slug: 'lyofilizovane-maliny-bila-cokolada',
    title: {
      cs: 'Lyofilizované maliny v bílé čokoládě',
      ru: 'Сублимированная малина в белом шоколаде',
      en: 'Freeze-dried raspberries in white chocolate',
    },
    price: 250,
    currency: 'CZK',
    description: {
      cs: 'Lyofilizované maliny v bílé čokoládě jsou malé gastronomické zázraky. Křupavé zvenku, jemné uvnitř, s výraznou chutí malin a krémovou hebkostí bílé čokolády.',
      ru: 'Сублимированная малина в белом шоколаде — хрустящая снаружи и нежная внутри, с яркой ягодной кислинкой и сливочной сладостью белого шоколада.',
      en: 'Freeze-dried raspberries coated in white chocolate: crisp outside, delicate inside, with vivid berry notes and creamy sweetness.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/SUB-malina.JPG',
    ],
  },

  {
    id: 'figs-chocolate',
    slug: 'fiky-v-cokolade',
    title: {
      cs: 'Fíky v čokoládě',
      ru: 'Инжир в шоколаде',
      en: 'Figs in chocolate',
    },
    price: 650,
    currency: 'CZK',
    description: {
      cs: 'Šťavnaté a měkké fíky obalené belgickou čokoládou. Harmonická kombinace přirozené sladkosti a jemné čokoládové chuti.',
      ru: 'Сочные и мягкие инжиры, покрытые бельгийским шоколадом. Гармония натуральной сладости и нежного шоколада.',
      en: 'Juicy, tender figs coated in Belgian chocolate, combining natural sweetness with refined cocoa notes.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/FIG.png',
    ],
  },

  {
    id: 'signature-raspberry',
    slug: 'amuerose-signature-malina',
    title: {
      cs: 'Amuerose Signature Malina',
      ru: 'Amuerose Signature Малина',
      en: 'Amuerose Signature Raspberry',
    },
    price: 690,
    currency: 'CZK',
    description: {
      cs: 'Pečlivě vybrané maliny v belgické čokoládě, ručně připravené v ateliéru Amuerose. Váha: 200 g.',
      ru: 'Отборная малина в бельгийском шоколаде, приготовленная вручную в ателье Amuerose. Вес: 200 г.',
      en: 'Carefully selected raspberries in Belgian chocolate, handmade in the Amuerose atelier. Weight: 200 g.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/malina.png',
    ],
  },

  {
    id: 'signature-blueberry',
    slug: 'amuerose-signature-boruvka',
    title: {
      cs: 'Amuerose Signature Borůvka',
      ru: 'Amuerose Signature Голубика',
      en: 'Amuerose Signature Blueberry',
    },
    price: 690,
    currency: 'CZK',
    description: {
      cs: 'Borůvky nejvyšší kvality v belgické čokoládě, ručně připravené v ateliéru Amuerose. Váha: 200 g.',
      ru: 'Голубика высшего качества в бельгийском шоколаде, ручная работа Amuerose. Вес: 200 г.',
      en: 'Premium blueberries in Belgian chocolate, handcrafted at the Amuerose atelier. Weight: 200 g.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/boruvka.png',
    ],
  },

  {
    id: 'kameja-set',
    slug: 'kameja',
    title: {
      cs: 'Kameja',
      ru: 'Камея',
      en: 'Cameo',
    },
    price: 875,
    currency: 'CZK',
    description: {
      cs: 'Set z 9 jahod v bílé čokoládě, zdobený ručně vyráběnými čokoládovými květy a retro kamejemi.',
      ru: 'набор из 9 клубник в белом шоколаеде, украшенный шоколадными цветами и ретро-камеями ручной работы.',
      en: 'A set of 9 strawberries in white chocolate, decorated with handmade chocolate flowers and retro cameo accents.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 11.webp',
    ],
  },

  {
    id: 'Old Prague',
    slug: 'Old Prague',
    title: {
      cs: 'Old Prague',
      ru: 'Old Prague',
      en: 'Old Prague',
    },
    price: 3090,
    currency: 'CZK',
    description: {
      cs: 'Mlécná cokoláda6-9 jahod, 6 plnënych datlí, (orechová / syrová náplñ), 200 g malin v cokoláde, 200 g borüvek v cokoláde, Luxusní dárkové balení.',
      ru: 'Молочный шоколад: 6–9 клубник, 6 фиников с начинкой-(ореховая / сырная начинка), 200 г малины в шоколаде, 200 г голубики в шоколаде, роскошная подарочная упаковка',
      en: 'Milk chocolate: 6–9 strawberries, 6 stuffed dates (nut / cheese filling), 200 g raspberries in chocolate, 200 g blueberries in chocolate, luxury gift packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 3.webp'
    ],
  },

  {
    id: 'reserve-heart',
    slug: 'Matcha Love',
    title: {
      cs: 'Matcha Love',
      ru: 'Matcha Love',
      en: 'Matcha Love',
    },
    price: 2190,
    currency: 'CZK',
    description: {
      cs: '16 jahod v matcha čokoládě, Dekorace z lyofilizovaných fíků a zlatých střikanců, Luxusní dárkové balení.',
      ru: '16 клубник в шоколаде матча, декор из лиофилизированных инжиров и золотых брызг, роскошная подарочная упаковка.',
      en: '16 strawberries in matcha chocolate, decoration with freeze-dried figs and golden splashes, luxury gift packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 7.webp'
    ]
  },

  {
    id: 'desire-heart',
    slug: 'Crimson Kiss',
    title: {
      cs: 'Crimson Kiss',
      ru: 'Crimson Kiss',
      en: 'Crimson Kiss',
    },
    price: 2190,
    currency: 'CZK',
    description: {
      cs: '16 jahod v hořké čokoládě, lyofilizovanych malin, Luxusní dárkové balení.',
      ru: '16 клубник в тёмном шоколаде, лиофилизированная малина, роскошная подарочная упаковка.',
      en: '16 strawberries in dark chocolate, freeze-dried raspberries, luxury gift packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 8.webp'
    ],
  },
  {
    id: 'jahody-cokolada-36',
    slug: 'jahody-v-cokolade-36',
    title: {
      cs: 'Jahody v čokoládě',
      ru: 'Клубника в шоколаде',
      en: 'Strawberries in chocolate',
    },
    price: 3300,
    currency: 'CZK',
    description: {
      cs: '36 jahod v mléčné a bílé čokoládě, dekor z liofilizovaných malin, malinový posyp a zlaté stříkance. Doplněno borůvkami v mléčné a bílé čokoládě.',
      ru: '36 ягод клубники в молочном и белом шоколаде, декор из сублимированной малины, малиновая посыпка и золотые брызги. Дополнено голубикой в молочном и белом шоколаде.',
      en: '36 strawberries in milk and white chocolate, finished with freeze-dried raspberries, raspberry crumble, and gold splashes. Includes blueberries in milk and white chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker100.webp',
    ],
  },
  {
    id: 'jahody-datle-cokolada',
    slug: 'jahody-datle-v-cokolade',
    title: {
      cs: 'Jahody a datle v čokoládě',
      ru: 'Клубника и финики в шоколаде',
      en: 'Strawberries and dates in chocolate',
    },
    price: 2075,
    currency: 'CZK',
    description: {
      cs: '4 datle s ořechovou náplní + 4 datle s karamelovým sýrem + 8 jahod v mléčné čokoládě. Ořechový posyp, drcený biskvit, zlaté stříkance. Borůvky a maliny v čokoládě.',
      ru: '4 финика с ореховой начинкой + 4 финика с карамельным сыром + 8 ягод клубники в молочном шоколаде. Ореховая посыпка, дроблёный бисквит, золотые брызги. Голубика и малина в шоколаде.',
      en: '4 dates with nut filling + 4 dates with caramel cheese + 8 strawberries in milk chocolate. Nut topping, crushed biscuit, gold splashes. Blueberries and raspberries in chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 14.webp',
    ],
  },
  {
    id: 'jahody-cokolada-9-fig',
    slug: 'jahody-v-cokolade-9-fig',
    title: {
      cs: 'Jahody v čokoládě',
      ru: 'Клубника в шоколаде',
      en: 'Strawberries in chocolate',
    },
    price: 1175,
    currency: 'CZK',
    description: {
      cs: '9 jahod v mléčné čokoládě, dekor z liofilizovaných fíků a zlaté stříkance. Borůvky v čokoládě.',
      ru: '9 ягод клубники в молочном шоколаде, декор из сублимированных инжиров и золотые брызги. Голубика в шоколаде.',
      en: '9 strawberries in milk chocolate, finished with freeze-dried figs and gold splashes. Blueberries in chocolate,',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 17.webp',
    ],
  },
  {
    id: 'velvet-love',
    slug: 'velvet-love',
    title: {
      cs: 'Velvet Love',
      ru: 'Velvet Love',
      en: 'Velvet Love',
    },
    price: 2490,
    currency: 'CZK',
    description: {
      cs: '13 jahod v mléčné čokoládě, dekorace z liofilizovaných fíků, čerstvých malin a jedlých třpytek. Čerstvé květiny. Luxusní balení.',
      ru: '13 ягод клубники в молочном шоколаде, декор из сублимированных инжиров, свежей малины и съедобных блёсток. Свежие цветы. Люксовая упаковка.',
      en: '13 strawberries in milk chocolate, decorated with freeze-dried figs, fresh raspberries, and edible glitter. Fresh flowers. Luxury packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker.webp',
    ],
  },
  {
    id: 'jahody-banany-cokolada',
    slug: 'jahody-banany-v-cokolade',
    title: {
      cs: 'Jahody a banány v čokoládě',
      ru: 'Клубника и бананы в шоколаде',
      en: 'Strawberries and bananas in chocolate',
    },
    price: 1175,
    currency: 'CZK',
    description: {
      cs: '3 banány + 6 jahod v mléčné čokoládě. Ořechový posyp, dekor z liofilizovaných fíků, zlaté stříkance. Borůvky v čokoládě.',
      ru: '3 банана + 6 ягод клубники в молочном шоколаде. Ореховая посыпка, декор из сублимированных инжиров, золотые брызги. Голубика в шоколаде.',
      en: '3 bananas + 6 strawberries in milk chocolate. Nut topping, freeze-dried fig decor, gold splashes. Blueberries in chocolate',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 9.webp',
    ],
  },
  {
    id: 'yahody a boruvky včokoládě',
    slug: 'yahody-a-boruvky-v-cokolade',
    title: {
      cs: 'Embrace Heart',
      ru: 'Embrace Heart',
      en: 'Embrace Heart',
    },
    price: 2490,
    currency: 'CZK',
    description: {
      cs: '16 jahod v růžové čokoládě, dekorace z lyofilizovaných fíků a čerstvých květů, luxusní dárkové balení',
      ru: '16 ягод клубники в розовом шоколаде, декор из сублимированных инжиров и свежих цветов, роскошная подарочная упаковка.',
      en: '16 strawberries in pink chocolate, decorated with freeze-dried figs and fresh flowers, luxury gift packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 25.webp',
    ],
  },
  {
    id: 'ahody, banány a datle v čokoládě',
    slug: 'ahody-banany-a-datle-v-cokolade',
    title: {
      cs: 'Jahody, banány a datle v čokoládě',
      ru: 'Клубника, бананы и финики в шоколаде',
      en: 'Strawberries, bananas and dates in chocolate',
    },
    price: 2695,
    currency: 'CZK',
    description: {
      cs: '5 datlí se sýrovou náplní, 15 jahod a 5 banánů v mléčné čokoládě, dekorace z lyofilizovaných fíků, zlaté stříkance, borůvky v čokoládě',
      ru: '5 фиников с сырной начинкой, 15 ягод клубники и 5 бананов в молочном шоколаде, декор из сублимированного инжира, золотые брызги, голубика в шоколаде.',
      en: '5 dates with cheese filling, 15 strawberries and 5 bananas in milk chocolate, decorated with freeze-dried figs, gold splashes, blueberries in chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 26.webp',
    ],
  },
  {
    id: 'jahody-cokolada-9-mix-raspberry',
    slug: 'jahody-v-cokolade-9-mix-raspberry',
    title: {
      cs: 'Jahody v čokoládě',
      ru: 'Клубника в шоколаде',
      en: 'Strawberries in chocolate',
    },
    price: 975,
    currency: 'CZK',
    description: {
      cs: '9 jahod ve směsi mléčné a bílé čokolády. Posyp a dekor z liofilizovaných malin a čerstvých malin v čokoládě. Zlaté stříkance.',
      ru: '9 ягод клубники в смеси молочного и белого шоколада. Посыпка и декор из сублимированной малины и свежей малины в шоколаде. Золотые брызги.',
      en: '9 strawberries in a mix of milk and white chocolate. Topping and decor of freeze-dried raspberries and fresh raspberries in chocolate. Gold splashes.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 13.webp',
    ],
  },
  {
    id: 'jahodovy-dort',
    slug: 'jahodovy-dort',
    title: {
      cs: 'Jahodový dort',
      ru: 'Клубничный торт',
      en: 'Strawberry cake',
    },
    price: 2590,
    currency: 'CZK',
    description: {
      cs: '27 jahod v mléčné čokoládě, ruční dekor květů z oplatkového papíru, zlaté stříkance.',
      ru: '27 ягод клубники в молочном шоколаде, ручной декор цветов из вафельной бумаги, золотые брызги.',
      en: '27 strawberries in milk chocolate with handmade wafer-paper flower decor and gold splashes.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 10.webp',
    ],
  },
  {
    id: 'jahody-cokolada-mix-16',
    slug: 'jahody-v-cokolade-mix-16',
    title: {
      cs: 'Jahody v čokoládě mix',
      ru: 'Клубника в шоколаде микс',
      en: 'Strawberries in chocolate mix',
    },
    price: 1300,
    currency: 'CZK',
    description: {
      cs: '16 jahod ve směsi mléčné a bílé čokolády, ořechový posyp.',
      ru: '16 ягод клубники в смеси молочного и белого шоколада, ореховая посыпка.',
      en: '16 strawberries in a mix of milk and white chocolate with a nut topping.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 15.webp',
    ],
  },
  {
    id: 'Duo Eclat',
    slug: 'duo-eclat',
    title: {
      cs: 'Duo Eclat',
      ru: 'Duo Eclat',
      en: 'Duo Eclat',
    },
    price: 2290,
    currency: 'CZK',
    description: {
      cs: '16 jahod v bílé a mléčné čokoládě, Zlaté stříkance, Luxusní dárkové balení',
      ru: '16 клубник в белом и молочном шоколаде, золотые брызги, роскошная подарочная упаковка.',
      en: '16 strawberries in white and milk chocolate, golden splashes, luxury gift packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 4.webp',
    ],
  },
  {
    id: 'Rose Embrace',
    slug: 'rose-embrace',
    title: {
      cs: 'Rose Embrace',
      ru: 'Rose Embrace',
      en: 'Rose Embrace',
    },
    price: 5990,
    currency: 'CZK',
    description: {
      cs: '40 jahod v růžové čokoládě, Dekorace z lyofilizovaných fíků a čerstvých květů, Luxusní dárkové balení.',
      ru: '40 клубник в розовом шоколаде, декор из лиофилизированных инжиров и свежих цветов, роскошная подарочная упаковка.',
      en: '40 strawberries in pink chocolate, decoration with freeze-dried figs and fresh flowers, luxury gift packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 5.webp',
    ],
  },
  {
    id: 'Velvet Evening',
    slug: 'velvet-evening',
    title: {
      cs: 'Velvet Evening',
      ru: 'Velvet Evening',
      en: 'Velvet Evening',
    },
    price: 2590,
    currency: 'CZK',
    description: {
      cs: '22 jahody v mléčné čokoládě, Dekorace ze zlatých stříkanců a malin v čokoládě, Luxusní dárkové balení.',
      ru: '22 клубники в молочном шоколаде, декор из золотых брызг и малины в шоколаде, роскошная подарочная упаковка.',
      en: '22 strawberries in milk chocolate with decoration of gold splashes and raspberries in chocolate, luxury gift packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 6.webp',
    ],
  },
  {
    id: 'yahody v čokoládě',
    slug: 'yahody-v-cokolade-9-lyo-gold',
    title: {
      cs: 'Jahody v čokoládě',
      ru: 'Клубника в шоколаде',
      en: 'Strawberries in chocolate',
    },
    price: 775,
    currency: 'CZK',
    description: {
      cs: '9 jahod v mléčné čokoládě, Posyp a dekor ze liofilizovaných malin, Zlaté strikance. ',
      ru: '9 клубник в молочном шоколаде, посыпка и декор из лиофилизированной малины, золотые брызги.',
      en: '9 strawberries in milk chocolate with a topping and decoration of freeze-dried raspberries and gold splashes.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 12.webp',
    ],
  },
  {
    id: 'yahody v čokoládě',
    slug: 'violet-mood',
    title: {
      cs: 'Violet Mood',
      ru: 'Violet Mood',
      en: 'Violet Mood',
    },
    price: 2190,
    currency: 'CZK',
    description: {
      cs: '16 jahod v mléčné čokoládě, dekorace z lyofilizovaných jedlých květů, zlaté stříkance a borůvky v mléčné čokoládě, luxusní dárkové balení',
      ru: '16 ягод клубники в молочном шоколаде, декор из сублимированных съедобных цветов, золотые брызги и голубика в молочном шоколаде, роскошная подарочная упаковка.',
      en: '16 strawberries in milk chocolate with decoration of freeze-dried flowers, golden splashes and blueberries in milk chocolate, luxury gift packaging.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 24.webp',
    ],
  },
  {
    id: 'yahody v čokoládě',
    slug: 'yahody-v-cokolade-9-nut-decor',
    title: {
      cs: 'Jahody v čokoládě',
      ru: 'Клубника в шоколаде',
      en: 'Strawberries in chocolate',
    },
    price: 975,
    currency: 'CZK',
    description: {
      cs: '9 jahod, ruční dekor z mléčné čokolády, ořechový posyp.',
      ru: '9 ягод клубники, ручной декор из молочного шоколада, ореховая посыпка.',
      en: '9 strawberries, handmade milk-chocolate decoration, nut topping.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 18.webp',
    ],
  },
   {
    id: 'yahody v čokoládě',
    slug: 'yahody-v-cokolade-16-kvety',
    title: {
      cs: 'Jahody v čokoládě',
      ru: 'Клубника в шоколаде',
      en: 'Strawberries in chocolate',
    },
    price: 1500,
    currency: 'CZK',
    description: {
      cs: '16 jahod, mléčná čokoláda, dekor z lyofilizovaných jedlých květů, ořechový posyp, borůvky v čokoládě',
      ru: '16 ягод клубники, молочный шоколад, декор из сублимированных цветов, ореховая посыпка, голубика в шоколаде.',
      en: '16 strawberries in milk chocolate with decoration of freeze-dried flowers, golden splashes, nut topping and blueberries in chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 20.webp',
    ],
  },
  {
    id: 'yahody a banany v čokoládě',
    slug: 'yahody-a-banany-v-cokolade',
    title: {
      cs: 'Jahody a banány v čokoládě',
      ru: 'Клубника и бананы в шоколаде',
      en: 'Strawberries and bananas in chocolate',
    },
    price: 1600,
    currency: 'CZK',
    description: {
      cs: '8 banánů v bílé čokoládě, 8 jahod v mléčné čokoládě, dekor z lyofilizovaných fíků, zlaté stříkance, ořechový posyp, borůvky v mléčné a bílé čokoládě',
      ru: '8 бананов в белом шоколаде, 8 ягод клубники в молочном шоколаде, декор из сублимированного инжира, золотые брызги, ореховая посыпка, голубика в молочном и белом шоколаде.',
      en: '8 bananas in white chocolate, 8 strawberries in milk chocolate, decoration of freeze-dried figs, golden splashes, nut topping, blueberries in milk and white chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 22.webp',
    ],
  },
  {
    id: 'Jahody a banány v čokoládě',
    slug: 'jahody-a-banany-v-cokolade',
    title: {
      cs: 'Jahody a banány v čokoládě',
      ru: 'Клубника и бананы в шоколаде',
      en: 'Strawberries and bananas in chocolate',
    },
    price: 975,
    currency: 'CZK',
    description: {
      cs: '9 jahod, dekor z lyofilizovaných květů, zlaté stříkance, ořechový posyp, borůvky v mléčné čokoládě.',
      ru: '9 ягод клубники, декор из сублимированных цветов, золотые брызги, ореховая посыпка, голубика в молочном шоколаде.',
      en: '9 strawberries with decoration of freeze-dried flowers, golden splashes, nut topping and blueberries in milk chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 19.webp',
    ],
  },
  {
    id: 'Jahody, banány a datle v čokoládě',
    slug: 'jahody-banany-a-datle-v-cokolade',
    title: {
      cs: 'Jahody, banány a datle v čokoládě',
      ru: 'Клубника, бананы и инжир в шоколаде',
      en: 'Strawberries, bananas and figs in chocolate',
    },
    price: 1795,
    currency: 'CZK',
    description: {
      cs: '4 datle s ořechovou náplní v horké čokoládě, 4 banány v horké čokoládě, 8 jahod v mléčné čokoládě, ruční dekor z horké čokolády, ořechový posyp a zlaté stříkance, borůvky v horké a mléčné čokoládě',
      ru: '4 финика с ореховой начинкой в тёмном шоколаде, 4 банана в тёмном шоколаде, 8 ягод клубники в молочном шоколаде, ручной декор из тёмного шоколада, ореховая посыпка и золотые брызги, голубика в тёмном и молочном шоколаде.',
      en: '4 dates with nut filling in dark chocolate, 4 bananas in dark chocolate, 8 strawberries in milk chocolate, handmade dark-chocolate decoration, nut topping and golden splashes, blueberries in dark and milk chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 23.webp',
    ],
  },
  {
    id: 'Jahody v čokoládě',
    slug: 'jahody-v-cokolade',
    title: {
      cs: 'Jahody v čokoládě',
      ru: 'Клубника в шоколаде',
      en: 'Strawberries in chocolate',
    },
    price: 1500,
    currency: 'CZK',
    description: {
      cs: '16 jahod, mléčná čokoláda, dekor z lyofilizovaných jedlých květů, zlaté stříkance, borůvky v čokoládě',
      ru: '16 ягод клубники, молочный шоколад, декор из сублимированных цветов, золотые брызги, голубика в шоколаде.',
      en: '16 strawberries in milk chocolate, decoration of freeze-dried edible flowers, golden splashes, blueberries in chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/sticker 21.webp',
    ],
  },
];
