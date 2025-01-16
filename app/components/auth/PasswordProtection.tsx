import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { encrypt } from '~/lib/crypto';
import { isAuthenticated } from '~/lib/stores/auth';

interface PasswordProtectionProps {
  onAuthenticate: () => void;
}

const AUTH_COOKIE = 'bolt_auth';
const SECRET_KEY = 'X9yZ2vKp4mN8qR5tL7wJ3hB6cF1gD0sA';
const MAX_COOKIE_DAYS = 400;

export function PasswordProtection({ onAuthenticate }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async () => {
    const expectedPassword = import.meta.env.BOLT_PASSWORD;
    
    if (password === expectedPassword) {
      try {
        const encrypted = await encrypt(SECRET_KEY, 'authenticated');
        Cookies.set(AUTH_COOKIE, encrypted, { 
          expires: MAX_COOKIE_DAYS,
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        });
        isAuthenticated.set(true);
        onAuthenticate();
      } catch (error) {
        console.error('Failed to set auth cookie:', error);
      }
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-bolt-elements-background-depth-1">
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, -10, 10, -10, 10, -10, 10, -10, 10, -10, 10, -10, 10, 0] } : {}}
        transition={{ 
          duration: 0.4,
          ease: "linear"
        }}
        className="p-8 bg-bolt-elements-background-depth-2 rounded-lg border border-bolt-elements-borderColor shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-bolt-elements-textPrimary">Password Required</h1>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="w-full px-4 py-2 rounded mb-4 bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor text-bolt-elements-textPrimary focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Enter password"
          autoFocus
        />
        <button 
          className="w-full px-4 py-2 bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-button-primary-text rounded transition-colors"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </motion.div>
    </div>
  );
} 