import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { PasswordProtection } from '~/components/auth/PasswordProtection';
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [{ title: 'myhomeIQ bolt.diy' }, { name: 'description', content: "Develop with myhomeIQ bolt.diy" }];
};

export const loader = () => json({});

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      {!isAuthenticated ? (
        <PasswordProtection onAuthenticate={handleAuth} />
      ) : (
        <div className="flex-1 overflow-hidden">
          <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>
        </div>
      )}
    </div>
  );
}
