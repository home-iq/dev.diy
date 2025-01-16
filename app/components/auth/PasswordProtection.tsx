import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PasswordProtectionProps {
  onAuthenticate: () => void;
}

export function PasswordProtection({ onAuthenticate }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = () => {
    if (password === 'rivendell') {
      onAuthenticate();
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-bolt-elements-background-depth-1">
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4, type: "spring" }}
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