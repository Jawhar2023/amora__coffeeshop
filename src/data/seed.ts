import { readKey, writeKey, StorageKeys, uid } from '@/services/storage/storageService';
import type {
  Category,
  Product,
  AddOnGroup,
  PromoCode,
  Order,
  Customer,
  GameConfig,
  QuizQuestion,
} from '@/types';
import { AMORA_MENU, AMORA_CATEGORIES } from '@/data/amoraMenu';

// Bump this whenever the seed data below changes shape so existing browsers
// with an older demo dataset pick up the new menu automatically.
export const SEED_VERSION = 11;

const MENU_IMG = (folder: string, slug?: string) => slug ? `/images/menu/${folder}/${slug}.webp` : `/images/menu/${folder}/menu-grid.jpg`;

function makeCategories(): Category[] {
  const defs: [string, string, string, string][] = [
    ['Petit déjeuner', 'Petit déjeuner', 'الفطور', '🥐'],
    ['Cafés', 'Cafés', 'القهوة', '☕'],
    ['Boissons chaudes', 'Boissons chaudes', 'مشروبات ساخنة', '🍫'],
    ['Frappuccinos', 'Frappuccinos', 'فرابتشينو', '🥤'],
    ['Cafés Glacés', 'Cafés Glacés', 'قهوة مثلجة', '🧊'],
    ['Milk shakes & Smoothies', 'Milk shakes & Smoothies', 'ميلك شيك وسموثي', '🥭'],
    ['Mojitos & Ice Tea', 'Mojitos & Ice Tea', 'موهيتو وشاي مثلج', '🍋'],
    ['Boissons fraîches', 'Boissons fraîches', 'مشروبات باردة', '🧃'],
    ['Salés & Pâtisseries', 'Salés & Pâtisseries', 'مالح وحلويات', '🥪'],
    ['Chicha', 'Chicha', 'شيشة', '🫖'],
  ];
  return defs.map(([name, nameFr, nameAr, icon], i) => ({
    id: uid('cat'),
    name,
    nameFr,
    nameAr,
    description: '',
    image: '',
    icon,
    order: i,
    isActive: true,
  }));
}

function makeAddOns(): AddOnGroup[] {
  return [];
}

interface MenuItemDef {
  name: string;
  nameFr?: string;
  category: string;
  price: number;
  desc: string;
  descFr?: string;
  folder: string;
  slug: string;
  featured?: boolean;
  popular?: boolean;
  isNew?: boolean;
}

function makeLegacyProducts(categories: Category[]): Product[] {
  const byName = (n: string) => categories.find((c) => c.name === n)!.id;
  const now = new Date().toISOString();

  const defs: MenuItemDef[] = [
    // Hot Coffee Specials
    { name: 'Vanilla Latte', category: 'Hot Coffee', price: 5.5, folder: 'hot-coffee', slug: 'vanilla-latte', desc: 'Espresso blended with smooth steamed milk and delicate vanilla sweetness.', popular: true },
    { name: 'Caramel Macchiato', category: 'Hot Coffee', price: 6, folder: 'hot-coffee', slug: 'caramel-macchiato', desc: 'Espresso marked with vanilla-scented milk and a swirl of caramel.', featured: true },
    { name: 'Toffee Nut Latte', category: 'Hot Coffee', price: 5.5, folder: 'hot-coffee', slug: 'toffee-nut-latte', desc: 'Steamed milk and espresso rounded out with warm toffee-nut syrup.' },
    { name: 'Chocolate Mocha', category: 'Hot Coffee', price: 6, folder: 'hot-coffee', slug: 'chocolate-mocha', desc: 'Rich espresso and chocolate sauce topped with silky steamed milk.', popular: true },
    { name: 'Cinnamon Honey Latte', category: 'Hot Coffee', price: 6, folder: 'hot-coffee', slug: 'cinnamon-honey-latte', desc: 'Espresso latte sweetened with honey and a touch of warm cinnamon.' },
    { name: 'Spanish Latte', category: 'Hot Coffee', price: 5.5, folder: 'hot-coffee', slug: 'spanish-latte', desc: 'Espresso with condensed milk for an extra creamy, sweet finish.' },
    { name: 'Brown Sugar Latte', category: 'Hot Coffee', price: 5.5, folder: 'hot-coffee', slug: 'brown-sugar-latte', desc: 'Espresso and steamed milk sweetened with rich brown sugar syrup.' },
    { name: 'Cookie Latte', category: 'Hot Coffee', price: 6, folder: 'hot-coffee', slug: 'cookie-latte', desc: 'Espresso latte with a cozy, cookie-inspired sweetness.' },
    { name: 'Hazelnut Latte', category: 'Hot Coffee', price: 5.5, folder: 'hot-coffee', slug: 'hazelnut-latte', desc: 'Espresso and steamed milk with smooth roasted hazelnut flavor.' },

    // Hot Coffee Classics
    { name: 'Americano', category: 'Classics', price: 3.5, folder: 'hot-coffee', slug: 'americano', desc: 'Espresso shots lengthened with hot water for a clean, bold cup.' },
    { name: 'Espresso', category: 'Classics', price: 3.2, folder: 'hot-coffee', slug: 'espresso', desc: 'A concentrated shot of our signature espresso blend.' },
    { name: 'Cappuccino', category: 'Classics', price: 4, folder: 'hot-coffee', slug: 'cappuccino', desc: 'Espresso with steamed milk and a thick layer of velvety foam.', popular: true },
    { name: 'Flat White', category: 'Classics', price: 4, folder: 'hot-coffee', slug: 'flat-white', desc: 'Espresso with silky microfoam milk for a smooth, balanced cup.' },
    { name: 'Café Turc', category: 'Classics', price: 6, folder: 'hot-coffee', slug: 'cafe-turc', desc: 'Finely ground coffee slowly simmered the traditional Turkish way.', featured: true },
    { name: 'Cappucin', category: 'Classics', price: 3.5, folder: 'hot-coffee', slug: 'cappucin', desc: 'Our everyday espresso and steamed milk, simple and comforting.' },

    // Extras
    { name: 'Coffee Shot ou Capsule', category: 'Extras', price: 1, folder: 'extras', slug: 'coffee-shot-capsule', desc: 'An extra shot of espresso to intensify any drink.' },
    { name: 'Sirop', category: 'Extras', price: 1.5, folder: 'extras', slug: 'sirop', desc: 'Add your favorite flavored syrup to any drink.' },
    { name: 'Non Dairy Milk', category: 'Extras', price: 2, folder: 'extras', slug: 'non-dairy-milk', desc: 'Swap in a plant-based milk of your choice.' },

    // Iced Coffees
    { name: 'Iced Vanilla', category: 'Iced Coffees', price: 8, folder: 'iced-coffee', slug: 'iced-vanilla', desc: 'Chilled espresso and milk over ice with smooth vanilla sweetness.' },
    { name: 'Iced Toffee Nut', category: 'Iced Coffees', price: 8, folder: 'iced-coffee', slug: 'iced-toffee-nut', desc: 'Espresso over ice with warm toffee-nut flavor and cold milk.' },
    { name: 'Iced Salted Caramel', category: 'Iced Coffees', price: 8.5, folder: 'iced-coffee', slug: 'iced-salted-caramel', desc: 'Iced espresso and milk with sweet caramel and a hint of salt.' },
    { name: 'Iced Chocolate Mocha', category: 'Iced Coffees', price: 8, folder: 'iced-coffee', slug: 'iced-chocolate-mocha', desc: 'Chilled espresso and chocolate over ice with cold milk.' },
    { name: 'Iced Cookie Butter', category: 'Iced Coffees', price: 8.5, folder: 'iced-coffee', slug: 'iced-cookie-butter', desc: 'Iced espresso with a cozy cookie-butter sweetness.', featured: true },
    { name: 'Iced Hazelnut', category: 'Iced Coffees', price: 8, folder: 'iced-coffee', slug: 'iced-hazelnut', desc: 'Espresso and cold milk over ice with roasted hazelnut flavor.' },
    { name: 'Iced Blueberry', category: 'Iced Coffees', price: 9.5, folder: 'iced-coffee', slug: 'iced-blueberry', desc: 'A fruity iced coffee twist with sweet blueberry flavor.' },
    { name: 'Iced Strawberry', category: 'Iced Coffees', price: 9.5, folder: 'iced-coffee', slug: 'iced-strawberry', desc: 'A fruity iced coffee twist with fresh strawberry flavor.' },
    { name: 'Iced Spanish', category: 'Iced Coffees', price: 8, folder: 'iced-coffee', slug: 'iced-spanish', desc: 'Espresso and condensed milk over ice for a creamy, sweet sip.' },
    { name: 'Iced Honey Cinnamon', category: 'Iced Coffees', price: 8.5, folder: 'iced-coffee', slug: 'iced-honey-cinnamon', desc: 'Iced espresso sweetened with honey and warm cinnamon.' },
    { name: 'Iced Tiramisu', category: 'Iced Coffees', price: 9.5, folder: 'iced-coffee', slug: 'iced-tiramisu', desc: 'Iced coffee inspired by the classic tiramisu flavor.', featured: true },
    { name: 'Iced Brown Sugar', category: 'Iced Coffees', price: 8, folder: 'iced-coffee', slug: 'iced-brown-sugar', desc: 'Espresso and milk over ice sweetened with brown sugar syrup.' },
    { name: 'Iced Latte', category: 'Iced Coffees', price: 7, folder: 'iced-coffee', slug: 'iced-latte', desc: 'Our classic espresso and cold milk, served over ice.', popular: true },

    // Shaken Espresso
    { name: 'Hazelnut Shaken Espresso', category: 'Shaken Espresso', price: 7, folder: 'shaken-espresso', slug: 'hazelnut-shaken-espresso', desc: 'Espresso hand-shaken with ice and roasted hazelnut flavor.' },
    { name: 'Brown Sugar Shaken Espresso', category: 'Shaken Espresso', price: 7, folder: 'shaken-espresso', slug: 'brown-sugar-shaken-espresso', desc: 'Espresso hand-shaken with ice and rich brown sugar.' },
    { name: 'Honey Shaken Espresso', category: 'Shaken Espresso', price: 8, folder: 'shaken-espresso', slug: 'honey-shaken-espresso', desc: 'Espresso hand-shaken with ice and natural honey.' },

    // Drinks
    { name: 'Hot Chocolate', category: 'Drinks', price: 6, folder: 'drinks', slug: 'hot-chocolate', desc: 'Rich, velvety melted chocolate served warm.' },
    { name: 'Hot Chocolate & Marshmallow', category: 'Drinks', price: 7.5, folder: 'drinks', slug: 'hot-chocolate-marshmallow', desc: 'Our hot chocolate topped with soft marshmallows.' },
    { name: 'Hot Chocolate & Whipped Cream', category: 'Drinks', price: 7, folder: 'drinks', slug: 'hot-chocolate-whipped-cream', desc: 'Our hot chocolate finished with a cloud of whipped cream.' },
    { name: 'Frappuccino Chocolat', category: 'Drinks', price: 8.5, folder: 'drinks', slug: 'frappuccino-chocolat', desc: 'A blended iced chocolate coffee treat, thick and refreshing.' },
    { name: 'Frappuccino Speculoos', category: 'Drinks', price: 8.5, folder: 'drinks', slug: 'frappuccino-speculoos', desc: 'A blended iced coffee treat with spiced speculoos flavor.' },
    { name: 'Frappuccino Caramel', category: 'Drinks', price: 8.5, folder: 'drinks', slug: 'frappuccino-caramel', desc: 'A blended iced coffee treat swirled with caramel.' },
    { name: 'Mojito Virgin', category: 'Drinks', price: 7, folder: 'drinks', slug: 'mojito-virgin', desc: 'Fresh mint and lime over ice, alcohol-free and refreshing.' },
    { name: 'Mojito Bleu', category: 'Drinks', price: 7.5, folder: 'drinks', slug: 'mojito-bleu', desc: 'Our virgin mojito with a vibrant blue twist.', featured: true },
    { name: 'Mojito Red', category: 'Drinks', price: 7.5, folder: 'drinks', slug: 'mojito-red', desc: 'Our virgin mojito with a fruity red twist.' },
    { name: 'Mojito Énergétique', category: 'Drinks', price: 8, folder: 'drinks', slug: 'mojito-energetique', desc: 'Our virgin mojito with an energizing boost.' },
    { name: 'Thé Vert à la Menthe', category: 'Drinks', price: 4, folder: 'drinks', slug: 'the-vert-menthe', desc: 'Traditional green tea steeped with fresh mint leaves.' },
    { name: 'Thé Vert aux Amandes', category: 'Drinks', price: 5.5, folder: 'drinks', slug: 'the-vert-amandes', desc: 'Green tea served with roasted almonds.' },
    { name: 'Thé Vert aux Pignons', category: 'Drinks', price: 6, folder: 'drinks', slug: 'the-vert-pignons', desc: 'Green tea served with toasted pine nuts.' },
    { name: 'Iced Tea Peach', category: 'Drinks', price: 9.5, folder: 'drinks', slug: 'iced-tea-peach', desc: 'Chilled iced tea with sweet, juicy peach flavor.', isNew: true, featured: true },

    // Jus
    { name: 'Jus Fraise', category: 'Jus', price: 5.5, folder: 'juices', slug: 'jus-fraise', desc: 'Freshly blended strawberry juice.' },
    { name: 'Citronnade', category: 'Jus', price: 5, folder: 'juices', slug: 'citronnade', desc: 'Fresh lemonade, bright and refreshing.' },
    { name: 'Pink Lemonade', category: 'Jus', price: 5.5, folder: 'juices', slug: 'pink-lemonade', desc: 'A fruity pink twist on classic lemonade.', featured: true },
    { name: 'Fruit de Bois', category: 'Jus', price: 8, folder: 'juices', slug: 'fruit-de-bois', desc: 'Freshly blended mixed berry juice.' },
    { name: 'Kiwi', category: 'Jus', price: 8, folder: 'juices', slug: 'kiwi', desc: 'Freshly blended kiwi juice.' },
    { name: 'Pêche Mangue', category: 'Jus', price: 8, folder: 'juices', slug: 'peche-mangue', desc: 'Freshly blended peach and mango juice.' },
  ];

  return defs.map((d, i) => {
    const price = d.price;
    const cost = Math.round(price * 0.4 * 100) / 100;
    return {
      id: uid('prod'),
      categoryId: byName(d.category),
      name: d.name,
      nameFr: d.nameFr ?? d.name,
      nameAr: d.name,
      description: d.desc,
      descriptionFr: d.descFr ?? d.desc,
      descriptionAr: d.desc,
      price,
      cost,
      image: MENU_IMG(d.folder, d.slug),
      available: true,
      featured: !!d.featured,
      popular: !!d.popular,
      isNew: !!d.isNew,
      spicy: false,
      vegetarian: false,
      preparationTime: 5,
      rating: 4.5 + ((i % 5) / 20),
      reviewCount: 20 + i * 3,
      ingredients: [],
      allergens: [],
      tags: [d.category.toLowerCase().replace(/\s+/g, '-')],
      addOnGroups: [],
      createdAt: now,
      updatedAt: now,
    };
  });
}

function makeAmoraCategories(): Category[] {
  return AMORA_CATEGORIES.map((category, order) => ({
    id: uid('cat'),
    name: category.title,
    nameFr: category.title,
    nameAr: category.title,
    description: '',
    image: `/images/menu/${category.id}/menu-grid.jpg`,
    icon: ['🥐', '☕', '🍫', '🥤', '🧊', '🥭', '🍋', '🧃', '🥪', '🫖'][order],
    order,
    isActive: true,
  }));
}

function makeProducts(categories: Category[]): Product[] {
  const categoryIds = new Map(categories.map((category, index) => [AMORA_CATEGORIES[index].id, category.id]));
  const now = new Date().toISOString();

  return AMORA_MENU.map((item, index) => ({
    id: uid('prod'),
    categoryId: categoryIds.get(item.category)!,
    name: item.name,
    nameFr: item.name,
    nameAr: item.name,
    description: item.description ?? '',
    descriptionFr: item.description ?? '',
    descriptionAr: item.description ?? '',
    price: item.price,
    cost: Math.round(item.price * 0.4 * 100) / 100,
    image: item.image,
    available: true,
    featured: index < 5,
    popular: false,
    spicy: false,
    vegetarian: false,
    preparationTime: 5,
    rating: 4.8,
    reviewCount: 0,
    ingredients: [],
    allergens: [],
    tags: [item.category],
    addOnGroups: [],
    createdAt: now,
    updatedAt: now,
  }));
}

function makePromos(): PromoCode[] {
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  const end = new Date();
  end.setMonth(end.getMonth() + 3);
  const s = start.toISOString();
  const e = end.toISOString();
  return [
    { id: uid('promo'), code: 'SUITENDISC5%', description: '5% off your order', discountType: 'percentage', discountValue: 5, minimumOrder: 0, startDate: s, endDate: e, usageLimit: 10000, usageCount: 0, active: true },
    { id: uid('promo'), code: 'SUMMER10', description: '10% off your order', discountType: 'percentage', discountValue: 10, minimumOrder: 50, startDate: s, endDate: e, usageLimit: 500, usageCount: 12, active: true },
    { id: uid('promo'), code: 'WELCOME15', description: '15 DT off orders above 100 DT', discountType: 'fixed', discountValue: 15, minimumOrder: 100, startDate: s, endDate: e, usageLimit: 200, usageCount: 5, active: true },
    { id: uid('promo'), code: 'FLAT20', description: '20 DT off, max 30 DT discount', discountType: 'fixed', discountValue: 20, minimumOrder: 150, maximumDiscount: 30, startDate: s, endDate: e, usageLimit: 100, usageCount: 30, active: true },
    { id: uid('promo'), code: 'EXPIRED5', description: 'Expired test promo', discountType: 'percentage', discountValue: 5, minimumOrder: 0, startDate: s, endDate: start.toISOString(), usageLimit: 100, usageCount: 100, active: false },
  ];
}

function makeCustomers(): Customer[] {
  const names = ['Ahmed Ben Ali', 'Sarah Trabelsi', 'Youssef Gharbi', 'Mariem Khadhraoui', 'Karim Bouazizi', 'Ines Chaouch', 'Mohamed Sassi', 'Lina Jendoubi', 'Omar Kacem', 'Nour Baccouche'];
  return names.map((name, i) => ({
    id: uid('cust'),
    name,
    phone: `+216 2${i}${(1000000 + i * 137).toString().slice(0, 6)}`,
    totalOrders: 3 + (i % 6),
    totalSpending: 150 + i * 47.5,
    favoriteProductIds: [],
    lastOrderAt: new Date(Date.now() - i * 86400000).toISOString(),
    createdAt: new Date(Date.now() - (30 + i) * 86400000).toISOString(),
  }));
}

function makeOrders(products: Product[]): Order[] {
  const statuses: Order['status'][] = ['served', 'served', 'served', 'ready', 'preparing', 'confirmed', 'pending', 'served', 'cancelled', 'served'];
  return statuses.map((status, i) => {
    const p1 = products[i % products.length];
    const p2 = products[(i * 3 + 2) % products.length];
    const qty1 = 1 + (i % 3);
    const qty2 = 1;
    const subtotal = p1.price * qty1 + p2.price * qty2;
    const total = subtotal;
    const createdAt = new Date(Date.now() - i * 3 * 3600000).toISOString();
    return {
      id: uid('order'),
      orderNumber: 1000 + i,
      items: [
        { productId: p1.id, name: p1.name, image: p1.image, unitPrice: p1.price, quantity: qty1, options: [], notes: '', lineTotal: p1.price * qty1 },
        { productId: p2.id, name: p2.name, image: p2.image, unitPrice: p2.price, quantity: qty2, options: [], notes: '', lineTotal: p2.price * qty2 },
      ],
      subtotal,
      addonsTotal: 0,
      discount: 0,
      total,
      status,
      createdAt,
      updatedAt: createdAt,
    };
  });
}

function makeGames(): GameConfig[] {
  return [
    { id: 'xo', name: 'Tic Tac Toe', description: 'Two players, one phone — first to line up 3 wins.', enabled: true, difficulty: 'easy', order: 0, icon: '⭕' },
    { id: 'water-sort', name: 'Water Sort', description: 'Pour and sort the colored liquid, one tube at a time.', enabled: true, difficulty: 'easy', order: 1, icon: '🧪' },
    { id: 'snake', name: 'Snake', description: 'Classic snake, restaurant style.', enabled: true, difficulty: 'medium', order: 2, icon: '🐍' },
    { id: 'memory', name: 'Memory Match', description: 'Match the food pairs.', enabled: true, difficulty: 'easy', order: 3, icon: '🧠' },
    { id: 'catch-food', name: 'Catch the Food', description: 'Catch falling dishes, avoid trash.', enabled: true, difficulty: 'medium', order: 4, icon: '🍔' },
    { id: 'reaction', name: 'Reaction Test', description: 'How fast are your reflexes?', enabled: true, difficulty: 'easy', order: 5, icon: '⚡' },
    { id: 'quiz', name: 'Tunisia Quiz', description: 'How well do you know Tunisia?', enabled: true, difficulty: 'easy', order: 6, icon: '🇹🇳' },
    { id: 'truth-or-dare', name: 'Truth or Dare', description: 'Pick truth or dare and have fun while you wait.', enabled: true, difficulty: 'easy', order: 7, icon: '🎭' },
    { id: 'block-blast', name: 'Block Blast', description: 'Fit the blocks, clear the lines.', enabled: true, difficulty: 'medium', order: 8, icon: '🧩' },
    { id: 'road-race', name: 'Road Race', description: 'Dodge traffic and rack up distance.', enabled: true, difficulty: 'medium', order: 9, icon: '🏎️' },
  ];
}

interface QuizSeed {
  q: [string, string, string];
  options: [string[], string[], string[]];
  correctIndex: number;
}

function makeQuiz(): QuizQuestion[] {
  const qs: QuizSeed[] = [
    {
      q: ['What is the capital of Tunisia?', 'Quelle est la capitale de la Tunisie ?', 'ما هي عاصمة تونس؟'],
      options: [
        ['Tunis', 'Sfax', 'Sousse', 'Bizerte'],
        ['Tunis', 'Sfax', 'Sousse', 'Bizerte'],
        ['تونس', 'صفاقس', 'سوسة', 'بنزرت'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'Which sea borders Tunisia to the north and east?',
        "Quelle mer borde la Tunisie au nord et à l'est ?",
        'أي بحر يحد تونس من الشمال والشرق؟',
      ],
      options: [
        ['Mediterranean Sea', 'Red Sea', 'Atlantic Ocean', 'Black Sea'],
        ['Mer Méditerranée', 'Mer Rouge', 'Océan Atlantique', 'Mer Noire'],
        ['البحر الأبيض المتوسط', 'البحر الأحمر', 'المحيط الأطلسي', 'البحر الأسود'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'Tunisia gained independence from France in which year?',
        "En quelle année la Tunisie a-t-elle obtenu son indépendance de la France ?",
        'في أي سنة حصلت تونس على استقلالها من فرنسا؟',
      ],
      options: [
        ['1956', '1962', '1945', '1970'],
        ['1956', '1962', '1945', '1970'],
        ['1956', '1962', '1945', '1970'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'What is the traditional red felt hat worn in Tunisia called?',
        "Comment s'appelle le chapeau de feutre rouge traditionnel porté en Tunisie ?",
        'ما اسم القبعة الحمراء التقليدية التي تُلبس في تونس؟',
      ],
      options: [
        ['Chechia', 'Fez', 'Turban', 'Keffiyeh'],
        ['Chéchia', 'Fez', 'Turban', 'Keffieh'],
        ['الشاشية', 'الطربوش', 'العمامة', 'الكوفية'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'Which ancient civilization founded Carthage, near modern Tunis?',
        "Quelle civilisation antique a fondé Carthage, près de l'actuelle Tunis ?",
        'أي حضارة قديمة أسست قرطاج، بالقرب من تونس الحالية؟',
      ],
      options: [
        ['Phoenicians', 'Romans', 'Greeks', 'Ottomans'],
        ['Les Phéniciens', 'Les Romains', 'Les Grecs', 'Les Ottomans'],
        ['الفينيقيون', 'الرومان', 'الإغريق', 'العثمانيون'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'What is the official currency of Tunisia?',
        'Quelle est la monnaie officielle de la Tunisie ?',
        'ما هي العملة الرسمية لتونس؟',
      ],
      options: [
        ['Tunisian Dinar', 'Tunisian Franc', 'Tunisian Pound', 'Tunisian Riyal'],
        ['Dinar tunisien', 'Franc tunisien', 'Livre tunisienne', 'Riyal tunisien'],
        ['الدينار التونسي', 'الفرنك التونسي', 'الجنيه التونسي', 'الريال التونسي'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'Which desert covers a large part of southern Tunisia?',
        'Quel désert couvre une grande partie du sud de la Tunisie ?',
        'أي صحراء تغطي جزءًا كبيرًا من جنوب تونس؟',
      ],
      options: [
        ['Sahara', 'Gobi', 'Kalahari', 'Atacama'],
        ['Le Sahara', 'Le Gobi', 'Le Kalahari', "L'Atacama"],
        ['الصحراء الكبرى', 'صحراء غوبي', 'صحراء كالاهاري', 'صحراء أتاكاما'],
      ],
      correctIndex: 0,
    },
    {
      q: ['What is the official language of Tunisia?', 'Quelle est la langue officielle de la Tunisie ?', 'ما هي اللغة الرسمية في تونس؟'],
      options: [
        ['Arabic', 'French', 'Berber', 'Italian'],
        ["L'arabe", 'Le français', 'Le berbère', "L'italien"],
        ['العربية', 'الفرنسية', 'الأمازيغية', 'الإيطالية'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'Which UNESCO World Heritage medina is famous in Tunis?',
        "Quelle médina classée au patrimoine mondial de l'UNESCO est célèbre à Tunis ?",
        'أي مدينة عتيقة مصنفة تراثًا عالميًا لليونسكو تشتهر في تونس؟',
      ],
      options: [
        ['Medina of Tunis', 'Medina of Fez', 'Medina of Marrakech', 'Medina of Cairo'],
        ['La médina de Tunis', 'La médina de Fès', 'La médina de Marrakech', 'La médina du Caire'],
        ['مدينة تونس العتيقة', 'مدينة فاس العتيقة', 'مدينة مراكش العتيقة', 'مدينة القاهرة العتيقة'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'What is the name of the famous Tunisian island known for its beaches and pottery?',
        'Quel est le nom de la célèbre île tunisienne connue pour ses plages et sa poterie ?',
        'ما اسم الجزيرة التونسية الشهيرة بشواطئها وفخارها؟',
      ],
      options: [
        ['Djerba', 'Malta', 'Corsica', 'Sicily'],
        ['Djerba', 'Malte', 'Corse', 'Sicile'],
        ['جربة', 'مالطا', 'كورسيكا', 'صقلية'],
      ],
      correctIndex: 0,
    },
    {
      q: ['Which sport is most popular in Tunisia?', 'Quel sport est le plus populaire en Tunisie ?', 'ما هي أكثر رياضة شعبية في تونس؟'],
      options: [
        ['Football', 'Cricket', 'Rugby', 'Baseball'],
        ['Le football', 'Le cricket', 'Le rugby', 'Le baseball'],
        ['كرة القدم', 'الكريكيت', 'الرغبي', 'البيسبول'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'What symbol appears at the center of the Tunisian flag?',
        'Quel symbole apparaît au centre du drapeau tunisien ?',
        'ما هو الرمز الذي يظهر في وسط العلم التونسي؟',
      ],
      options: [
        ['A red crescent and star', 'An eagle', 'A palm tree', 'A lion'],
        ['Un croissant et une étoile rouges', 'Un aigle', 'Un palmier', 'Un lion'],
        ['هلال ونجمة حمراء', 'نسر', 'نخلة', 'أسد'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'Which mountain range runs through northern Tunisia?',
        'Quelle chaîne de montagnes traverse le nord de la Tunisie ?',
        'أي سلسلة جبلية تمتد عبر شمال تونس؟',
      ],
      options: [
        ['Atlas Mountains', 'Alps', 'Andes', 'Pyrenees'],
        ["Les montagnes de l'Atlas", 'Les Alpes', 'Les Andes', 'Les Pyrénées'],
        ['جبال الأطلس', 'جبال الألب', 'جبال الأنديز', 'جبال البرانس'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'What is a traditional Tunisian doorway often decorated with?',
        'Avec quoi les portes traditionnelles tunisiennes sont-elles souvent décorées ?',
        'بماذا تُزيَّن الأبواب التونسية التقليدية غالبًا؟',
      ],
      options: [
        ['Blue-painted wood and metal studs', 'Stained glass', 'Bamboo', 'Marble columns'],
        ['Du bois peint en bleu et des clous en métal', 'Du vitrail', 'Du bambou', 'Des colonnes en marbre'],
        ['خشب مطلي باللون الأزرق ومسامير معدنية', 'زجاج ملون', 'خيزران', 'أعمدة رخامية'],
      ],
      correctIndex: 0,
    },
    {
      q: [
        'Tunisia is part of which larger world region?',
        'La Tunisie fait partie de quelle grande région du monde ?',
        'تونس جزء من أي منطقة كبرى في العالم؟',
      ],
      options: [
        ['North Africa', 'West Africa', 'Southern Europe', 'Middle East'],
        ["L'Afrique du Nord", "L'Afrique de l'Ouest", "L'Europe du Sud", 'Le Moyen-Orient'],
        ['شمال إفريقيا', 'غرب إفريقيا', 'جنوب أوروبا', 'الشرق الأوسط'],
      ],
      correctIndex: 0,
    },
  ];

  return qs.map(({ q, options, correctIndex }) => ({
    id: uid('quiz'),
    question: q[0],
    questionFr: q[1],
    questionAr: q[2],
    options: options[0],
    optionsFr: options[1],
    optionsAr: options[2],
    correctIndex,
  }));
}

// Patches in any games added after a browser was first seeded (e.g. a newly
// shipped game) without touching existing data or admin customizations.
function ensureGamesUpToDate(): void {
  const existing = readKey<GameConfig[]>(StorageKeys.games, []).filter((g) => g.id !== 'color-mix');
  const existingIds = new Set(existing.map((g) => g.id));
  const missing = makeGames().filter((g) => !existingIds.has(g.id));
  if (missing.length > 0) {
    writeKey(StorageKeys.games, [...existing, ...missing]);
  }
}

export function initializeDemoData(force = false): void {
  const seeded = readKey<boolean>(StorageKeys.seeded, false);
  const seedVersion = readKey<number>(StorageKeys.seedVersion, 0);
  if (seeded && !force && seedVersion >= SEED_VERSION) {
    ensureGamesUpToDate();
    return;
  }

  const categories = makeAmoraCategories();
  const addOns = makeAddOns();
  const products = makeProducts(categories);
  const promos = makePromos();
  const customers = makeCustomers();
  const orders = makeOrders(products);
  const games = makeGames();
  const quiz = makeQuiz();

  writeKey(StorageKeys.categories, categories);
  writeKey(StorageKeys.addOnGroups, addOns);
  writeKey(StorageKeys.products, products);
  writeKey(StorageKeys.promoCodes, promos);
  writeKey(StorageKeys.customers, customers);
  writeKey(StorageKeys.orders, orders);
  writeKey(StorageKeys.orderSeq, 1000 + orders.length);
  writeKey(StorageKeys.games, games);
  writeKey(StorageKeys.quizQuestions, quiz);
  writeKey(StorageKeys.seeded, true);
  writeKey(StorageKeys.seedVersion, SEED_VERSION);
}

export function resetDemoData(): void {
  initializeDemoData(true);
}
