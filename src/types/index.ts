// ---------- Core domain models ----------

export type Language = 'en' | 'fr' | 'ar';

export interface Category {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  description: string;
  image: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface AddOnOption {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  price: number;
  cost: number;
  available: boolean;
}

export interface AddOnGroup {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  required: boolean;
  maxSelections?: number;
  options: AddOnOption[];
}

export interface Product {
  id: string;
  categoryId: string;

  name: string;
  nameFr: string;
  nameAr: string;

  description: string;
  descriptionFr: string;
  descriptionAr: string;

  price: number;
  cost: number;
  discountPrice?: number;

  image: string;

  available: boolean;
  stockQuantity?: number;
  featured: boolean;
  popular: boolean;
  isNew?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;

  preparationTime: number;
  rating: number;
  reviewCount: number;

  ingredients: string[];
  allergens: string[];
  tags: string[];

  addOnGroups: string[]; // AddOnGroup ids

  createdAt: string;
  updatedAt: string;
}

export type DiscountType = 'percentage' | 'fixed';

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minimumOrder: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  active: boolean;
}

export interface CartItemOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart line id
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOption[];
  notes: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOption[];
  notes: string;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  addonsTotal: number;
  discount: number;
  promoCode?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name?: string;
  phone?: string;
  totalOrders: number;
  totalSpending: number;
  favoriteProductIds: string[];
  lastOrderAt?: string;
  createdAt: string;
}

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  icon: string;
}

export interface GameScore {
  gameId: string;
  score: number;
  playedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionFr?: string;
  questionAr?: string;
  options: string[];
  optionsFr?: string[];
  optionsAr?: string[];
  correctIndex: number;
}

export interface ReviewTracking {
  ctaShown: number;
  ctaClicked: number;
  gameLosses: number;
}

export interface RestaurantSettings {
  restaurantName: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappNumber: string;
  currency: string;
  googleReviewUrl: string;
  defaultLanguage: Language;
  enableGames: boolean;
  enableOrdering: boolean;
  enablePromoCodes: boolean;
  enableFavorites: boolean;
  enableCustomerNotes: boolean;
}

export interface AdminUser {
  email: string;
  password: string;
}
