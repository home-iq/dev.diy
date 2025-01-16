import React from 'react';
import { useStore } from '@nanostores/react';
import { isAuthenticated, isAuthLoading } from '~/lib/stores/auth';
import { PasswordProtection } from './PasswordProtection';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const isAuth = useStore(isAuthenticated);
  const isLoading = useStore(isAuthLoading);

  // While loading, show nothing or a loading state
  if (isLoading) {
    return children;
  }

  // After loading, show password screen if not authenticated
  if (!isAuth) {
    return <PasswordProtection onAuthenticate={() => {}} />;
  }

  // Show content if authenticated
  return children;
} 