export interface AmoraMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
}

export interface AmoraMenuCategory {
  id: string;
  title: string;
}

const image = (category: string, id: string) => `/images/menu/${category}/${id}.jpg`;

export const AMORA_CATEGORIES: AmoraMenuCategory[] = [
  { id: 'petit-dejeuner', title: 'Petit déjeuner' },
  { id: 'cafes', title: 'Cafés' },
  { id: 'boissons-chaudes', title: 'Boissons chaudes' },
  { id: 'frappuccinos', title: 'Frappuccinos' },
  { id: 'cafes-glaces', title: 'Cafés Glacés' },
  { id: 'milkshakes-smoothies', title: 'Milk shakes & Smoothies' },
  { id: 'mojitos-ice-tea', title: 'Mojitos & Ice Tea' },
  { id: 'boissons-fraiches', title: 'Boissons fraîches' },
  { id: 'sales-patisseries', title: 'Salés & Pâtisseries' },
  { id: 'chicha', title: 'Chicha' },
];

const items = [
  ['Formule Amora', 5.5, 'petit-dejeuner'], ['Formule Amora plus', 6.5, 'petit-dejeuner'],
  ['Express', 2.5, 'cafes'], ['Capucin', 2.8, 'cafes'], ['Nescafé', 3, 'cafes'], ['Cappuccino', 4.5, 'cafes'], ['Café crème', 3, 'cafes'], ['Américain', 2.8, 'cafes'],
  ['Chocolat au lait', 3.5, 'boissons-chaudes'], ['Chocolat chaud', 6.5, 'boissons-chaudes'], ['Hot nutella', 8, 'boissons-chaudes'], ['Kyufi', 3, 'boissons-chaudes'],
  ['Frappuccino', 7.5, 'frappuccinos'], ['Frappuccino vanille', 5.3, 'frappuccinos'], ['Frappuccino noisette', 5.3, 'frappuccinos'], ['Frappuccino caramel', 6.3, 'frappuccinos'], ['Frappuccino kinder', 6.7, 'frappuccinos'], ['Frappuccino pistache', 6.7, 'frappuccinos'], ['Frappuccino sneakers', 6.7, 'frappuccinos'], ['Frappuccino nutella', 8.5, 'frappuccinos'], ['Frappuccino ferrero rocher', 6.7, 'frappuccinos'],
  ['Expresso tonic', 4.5, 'cafes-glaces'], ['Ice coffee latte', 4.5, 'cafes-glaces'], ['Iced americano', 5, 'cafes-glaces'], ['Ice coffee aromatisée', 5.4, 'cafes-glaces'], ['Honey iced americano', 6, 'cafes-glaces'],
  ['Smoothie', 7, 'milkshakes-smoothies', 'pêche, myrtille, melon, fruit de bois, fruit de passion, cerise, noix de coco, kiwi'], ['Smoothie mangue', 7.8, 'milkshakes-smoothies'], ['Milk shake', 7.5, 'milkshakes-smoothies'], ['Milk shake Nutella', 8.5, 'milkshakes-smoothies'], ['Milk shake Oreo', 8.5, 'milkshakes-smoothies'],
  ['Virgin mojito', 5.5, 'mojitos-ice-tea'], ['Blue mojito', 6.5, 'mojitos-ice-tea'], ['Energy mojito', 8, 'mojitos-ice-tea'], ['Iced tea', 5.5, 'mojitos-ice-tea'], ['Iced tea kiwi', 5.5, 'mojitos-ice-tea'],
  ['Eau 0.5l', 1.2, 'boissons-fraiches'], ['Eau 1l', 2, 'boissons-fraiches'], ['Soda', 2.8, 'boissons-fraiches'], ['Shark', 5.3, 'boissons-fraiches'], ['Jus orange', 3, 'boissons-fraiches'], ['Jus grenadine', 3, 'boissons-fraiches'], ['Jus ananas', 3, 'boissons-fraiches'], ['Citronnade', 3, 'boissons-fraiches'], ['Jus fraise', 4.5, 'boissons-fraiches'],
  ['Panini thon', 3.4, 'sales-patisseries'], ['Soufflé', 3.5, 'sales-patisseries'], ['Panini thon fromage', 3.8, 'sales-patisseries'], ['Pizza tranche', 4, 'sales-patisseries'], ['Tahricha time', 5.8, 'sales-patisseries', 'panini + soda'], ['Panini + soda', 5.5, 'sales-patisseries'], ['Brownies', 5.5, 'sales-patisseries'], ['Brownies pistache', 6.5, 'sales-patisseries'], ['Cake', 2, 'sales-patisseries'], ['Pain au chocolat', 2.3, 'sales-patisseries'], ['Croissant amande', 2.4, 'sales-patisseries'], ['Tarte amande', 2.8, 'sales-patisseries'], ['Mille-feuille', 3.6, 'sales-patisseries'], ['Gâteau chocolat', 4.5, 'sales-patisseries'], ['Cheesecake', 5, 'sales-patisseries'],
  ['Chicha Menthe', 7.5, 'chicha'], ['Chicha love', 8, 'chicha'], ['Chicha chi5 money', 8, 'chicha'],
] as const;

const slugify = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const AMORA_MENU: AmoraMenuItem[] = items.map(([name, price, category, description]) => ({
  id: slugify(name),
  name,
  description,
  price,
  image: image(category, slugify(name)),
  category,
}));
