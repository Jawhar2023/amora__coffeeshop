import { readKey, writeKey, removeKey, StorageKeys } from './storageService';

// Demo-only admin auth. Not secure — replace with a real auth provider
// (Supabase/Firebase/custom backend) before production use.
const DEMO_ADMIN = { email: 'admin@flavorlab.com', password: 'admin123' };

export const AuthRepository = {
  isLoggedIn(): boolean {
    return readKey<boolean>(StorageKeys.adminAuth, false);
  },
  login(email: string, password: string): boolean {
    const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
    if (ok) writeKey(StorageKeys.adminAuth, true);
    return ok;
  },
  logout(): void {
    removeKey(StorageKeys.adminAuth);
  },
};
