import { useMatches } from '@remix-run/react';

export function useEnv() {
  const matches = useMatches();
  const rootData = matches[0].data as { env: { BOLT_PASSWORD: string } };
  
  if (!rootData?.env?.BOLT_PASSWORD) {
    throw new Error('Environment variables not available');
  }
  
  return rootData.env;
} 