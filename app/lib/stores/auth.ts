import { atom } from 'nanostores';
import Cookies from 'js-cookie';
import { decrypt } from '~/lib/crypto';

const AUTH_COOKIE = 'bolt_auth';
const SECRET_KEY = 'X9yZ2vKp4mN8qR5tL7wJ3hB6cF1gD0sA';

// Initialize with loading true
export const isAuthLoading = atom<boolean>(true);
export const isAuthenticated = atom<boolean>(false);

// Initialize the auth state immediately
(async () => {
  try {
    const authCookie = Cookies.get(AUTH_COOKIE);
    if (authCookie) {
      const decrypted = await decrypt(SECRET_KEY, authCookie);
      if (decrypted === 'authenticated') {
        isAuthenticated.set(true);
      }
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    Cookies.remove(AUTH_COOKIE);
  } finally {
    isAuthLoading.set(false);
  }
})();

// This function is now only for explicit re-checks
export async function initAuth() {
  isAuthLoading.set(true);
  try {
    const authCookie = Cookies.get(AUTH_COOKIE);
    if (authCookie) {
      const decrypted = await decrypt(SECRET_KEY, authCookie);
      if (decrypted === 'authenticated') {
        isAuthenticated.set(true);
      }
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    Cookies.remove(AUTH_COOKIE);
  } finally {
    isAuthLoading.set(false);
  }
} 