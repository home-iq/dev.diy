import { useStore } from '@nanostores/react';
import { isAuthenticated, isAuthLoading } from '~/lib/stores/auth';
import { motion } from 'framer-motion';
import { PasswordProtection } from './PasswordProtection';
import { useEffect, useState } from 'react';

function LoadingSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <motion.div
        className="w-12 h-12 border-4 border-bolt-elements-textSecondary border-t-accent-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const isAuth = useStore(isAuthenticated);
  const isLoading = useStore(isAuthLoading);
  const [showPasswordDelay, setShowPasswordDelay] = useState(true);

  // Always show spinner for at least 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPasswordDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show spinner while loading or during initial delay
  if (isLoading || showPasswordDelay) {
    return <LoadingSpinner />;
  }

  if (!isAuth) {
    return <PasswordProtection onAuthenticate={() => {}} />;
  }

  return <>{children}</>;
} 