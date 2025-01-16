import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { decrypt } from '~/lib/crypto';

const AUTH_COOKIE = 'bolt_auth';
const SECRET_KEY = 'bolt_secret';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authCookie = Cookies.get(AUTH_COOKIE);
        if (authCookie) {
          const decrypted = await decrypt(SECRET_KEY, authCookie);
          if (decrypted === 'authenticated') {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        Cookies.remove(AUTH_COOKIE);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isCheckingAuth,
    setIsAuthenticated
  };
} 