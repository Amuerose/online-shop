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
      cs: 'Exkluzivní sada jahod v bílé čokoládě, zdobená ručně vyráběnými čokoládovými růžemi a retro kamejemi. Luxusní dárek.',
      ru: 'Эксклюзивный набор клубники в белом шоколаде с ручной шоколадной декорацией и ретро-камеями.',
      en: 'An exclusive set of strawberries in white chocolate, adorned with handcrafted chocolate roses and retro cameos.',
    },
    allergens: '6, 7',
    gallery: [
      '/images/kameja.png',
    ],
  },

  {
    id: 'dates-berries-selection-premium',
    slug: 'dates-berries-selection',
    title: {
      cs: 'Datle & Berries Selection',
      ru: 'Datle & Berries Selection',
      en: 'Datle & Berries Selection',
    },
    price: 3000,
    currency: 'CZK',
    description: {
      cs: 'Kulatá prémiová kompozice z datlí, jahod, malin a borůvek v čokoládě. Vyvážená struktura chutí a textur, ruční zpracování a klidná, sebevědomá estetika Amuerose.',
      ru: 'Круглая премиальная композиция из фиников, клубники, малины и голубики в шоколаде. Выверенный баланс вкусов и текстур, ручная работа и спокойная, уверенная эстетика Amuerose.',
      en: 'A round premium composition of dates, strawberries, raspberries, and blueberries in chocolate. Balanced flavors and textures, handcrafted execution, and calm, confident Amuerose aesthetics.',
    },
    allergens: '6, 7',
    gallery: [
      '/images/IMG_7726.PNG'
    ],
  },

  {
    id: 'reserve-heart',
    slug: 'reserve',
    title: {
      cs: 'Reserve',
      ru: 'Reserve',
      en: 'Reserve',
    },
    price: 2500,
    currency: 'CZK',
    description: {
      cs: 'Srdce s jahodami v čokoládě v zeleném provedení, doplněné lyofilizovaným fíkem. Střídmá estetika, odstup a charakter pro ty, kteří volí vědomě.',
      ru: 'Сердце с клубникой в шоколаде в зелёном исполнении, дополненное сублимированным инжиром. Сдержанная эстетика, дистанция и характер для тех, кто выбирает осознанно.',
      en: 'A heart-shaped set of strawberries in chocolate in a green edition, finished with freeze-dried fig. Reserved aesthetics and character for those who choose selectively.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/rubi.png'
    ]
  },

  {
    id: 'desire-heart',
    slug: 'desire',
    title: {
      cs: 'Desire',
      ru: 'Desire',
      en: 'Desire',
    },
    price: 2500,
    currency: 'CZK',
    description: {
      cs: 'Srdce s jahodami v mléčné čokoládě, ručně dekorované lyofilizovanou malinou. Intenzivní, hřejivá kompozice s výraznou emocí.',
      ru: 'Сердце с клубникой в молочном шоколаде, вручную декорированное сублимированной малиной. Тёплая, насыщенная композиция с ярко выраженной эмоцией.',
      en: 'A heart-shaped composition of strawberries in milk chocolate, hand-finished with freeze-dried raspberry. Warm, intense character with a clear emotional accent.',
    },
    allergens: '6, 7',
    gallery: [
      '/products/desire.png'
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
      '/images/IMG_7718.PNG',
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
      cs: '4 datle s ořechovou náplní + 4 datle s karamelovým sýrem + 8 jahod v mléčné čokoládě. Ořechový posyp, drcený biskvit, zlaté stříkance. Borůvky (100 g) a maliny (100 g) v čokoládě.',
      ru: '4 финика с ореховой начинкой + 4 финика с карамельным сыром + 8 ягод клубники в молочном шоколаде. Ореховая посыпка, дроблёный бисквит, золотые брызги. Голубика (100 г) и малина (100 г) в шоколаде.',
      en: '4 dates with nut filling + 4 dates with caramel cheese + 8 strawberries in milk chocolate. Nut topping, crushed biscuit, gold splashes. Blueberries (100 g) and raspberries (100 g) in chocolate.',
    },
    allergens: '6, 7',
    gallery: [
      '/images/IMG_7766.PNG',
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
      cs: '9 jahod v mléčné čokoládě, dekor z liofilizovaných fíků a zlaté stříkance. Borůvky v čokoládě double porce (200 g).',
      ru: '9 ягод клубники в молочном шоколаде, декор из сублимированных инжиров и золотые брызги. Голубика в шоколаде двойная порция (200 г).',
      en: '9 strawberries in milk chocolate, finished with freeze-dried figs and gold splashes. Blueberries in chocolate, double portion (200 g).',
    },
    allergens: '6, 7',
    gallery: [
      '/images/IMG_8271.PNG',
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
      '/images/IMG_8270.PNG',
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
      cs: '3 banány + 6 jahod v mléčné čokoládě. Ořechový posyp, dekor z liofilizovaných fíků, zlaté stříkance. Borůvky v čokoládě double porce (200 g).',
      ru: '3 банана + 6 ягод клубники в молочном шоколаде. Ореховая посыпка, декор из сублимированных инжиров, золотые брызги. Голубика в шоколаде двойная порция (200 г).',
      en: '3 bananas + 6 strawberries in milk chocolate. Nut topping, freeze-dried fig decor, gold splashes. Blueberries in chocolate, double portion (200 g).',
    },
    allergens: '6, 7',
    gallery: [
      '/images/IMG_8269.PNG',
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
      '/images/IMG_8268.PNG',
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
    price: 2250,
    currency: 'CZK',
    description: {
      cs: '27 jahod v mléčné čokoládě, ruční dekor květů z oplatkového papíru, zlaté stříkance.',
      ru: '27 ягод клубники в молочном шоколаде, ручной декор цветов из вафельной бумаги, золотые брызги.',
      en: '27 strawberries in milk chocolate with handmade wafer-paper flower decor and gold splashes.',
    },
    allergens: '6, 7',
    gallery: [
      '/images/IMG_8267.PNG',
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
      '/images/IMG_8265.PNG',
    ],
  },
];
