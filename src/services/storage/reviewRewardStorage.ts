import { readKey, writeKey, StorageKeys } from './storageService';
import { PromoRepository } from './promoStorage';

// Short, pronounceable words so the reward code is easy to say and remember,
// paired with a random 3-digit number to keep each customer's code unique.
const WORDS = ['TASTY', 'YUMMY', 'FRESH', 'MERCI', 'THANKS', 'FOODIE', 'SAVOR', 'DELISH', 'CHEF', 'SUITEN'];

const REWARD_DISCOUNT_DT = 1;
const VALID_DAYS = 90;

function generateCode(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const number = Math.floor(100 + Math.random() * 900); // 3 digits, never starts with 0
  return `${word}${number}`;
}

function generateUniqueCode(): string {
  let code = generateCode();
  let attempts = 0;
  while (PromoRepository.getByCode(code) && attempts < 10) {
    code = generateCode();
    attempts += 1;
  }
  return code;
}

export const ReviewRewardRepository = {
  /** The customer's existing reward code, if they've already claimed one. */
  getExistingCode(): string | null {
    return readKey<string | null>(StorageKeys.reviewRewardCode, null);
  },

  /**
   * Returns this device's one-time review reward code, creating it (and its
   * backing single-use promo) the first time it's claimed. Calling it again
   * always returns the same code — one client, one code, usable once.
   */
  getOrCreateCode(): string {
    const existing = this.getExistingCode();
    if (existing) return existing;

    const code = generateUniqueCode();
    const now = new Date();
    const end = new Date(now.getTime() + VALID_DAYS * 86400000);

    PromoRepository.create({
      code,
      description: 'Thank you for your review! 🎉',
      discountType: 'fixed',
      discountValue: REWARD_DISCOUNT_DT,
      minimumOrder: 0,
      startDate: now.toISOString(),
      endDate: end.toISOString(),
      usageLimit: 1,
      active: true,
    });

    writeKey(StorageKeys.reviewRewardCode, code);
    return code;
  },
};
