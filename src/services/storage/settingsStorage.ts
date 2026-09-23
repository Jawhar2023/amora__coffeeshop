import { readKey, writeKey, StorageKeys } from './storageService';
import type { RestaurantSettings } from '@/types';

export const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: 'Amora',
  logo: '/amora-logo.png',
  phone: '',
  email: '',
  address: '',
  openingHours: '',
  facebookUrl: '',
  instagramUrl: 'https://www.instagram.com/amora__coffeeshop/?hl=fr',
  tiktokUrl: 'https://www.tiktok.com/@amora.coffee.shop',
  whatsappNumber: '',
  currency: 'DT',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJAWXNDKOL_RIRPGxFqdLfS-0',
  defaultLanguage: 'en',
  enableGames: true,
  enableOrdering: true,
  enablePromoCodes: true,
  enableFavorites: true,
  enableCustomerNotes: true,
};

export const SettingsRepository = {
  get(): RestaurantSettings {
    return readKey<RestaurantSettings>(StorageKeys.settings, DEFAULT_SETTINGS);
  },
  update(patch: Partial<RestaurantSettings>): RestaurantSettings {
    const next = { ...this.get(), ...patch };
    writeKey(StorageKeys.settings, next);
    return next;
  },
};
