import { useStore } from '@nanostores/react';
import type { LinksFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation, useLocation } from '@remix-run/react';
import tailwindReset from '@unocss/reset/tailwind-compat.css?url';
import { themeStore } from './lib/stores/theme';
import { stripIndents } from './utils/stripIndent';
import { createHead } from 'remix-island';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import reactToastifyStyles from 'react-toastify/dist/ReactToastify.css?url';
import globalStyles from './styles/index.scss?url';
import xtermStyles from '@xterm/xterm/css/xterm.css?url';

import 'virtual:uno.css';
import { ToastContainer } from 'react-toastify';
import { initAuth } from '~/lib/stores/auth';

export const links: LinksFunction = () => [
  {
    rel: 'icon',
    href: '/favicon.svg',
    type: 'image/svg+xml',
  },
  { rel: 'stylesheet', href: reactToastifyStyles },
  { rel: 'stylesheet', href: tailwindReset },
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: xtermStyles },
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
];

const inlineThemeCode = stripIndents`
  setTutorialKitTheme();

  function setTutorialKitTheme() {
    let theme = localStorage.getItem('bolt_theme');

    if (!theme) {
      theme = 'dark';
    }

    document.querySelector('html')?.setAttribute('data-theme', theme);
  }
`;

export const Head = createHead(() => (
  <>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <Meta />
    <Links />
    <script dangerouslySetInnerHTML={{ __html: inlineThemeCode }} />
  </>
));

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bolt-elements-background-depth-1">
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

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useStore(themeStore);
  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }, [theme]);

  // Show loading spinner during navigation
  if (navigation.state === "loading") {
    return (
      <div id="app-root">
        <LoadingSpinner />
        <ScrollRestoration />
        <Scripts />
        <ToastContainer position="bottom-right" theme={theme as "light" | "dark"} />
      </div>
    );
  }

  return (
    <div id="app-root">
      {children}
      <ScrollRestoration />
      <Scripts />
      <ToastContainer position="bottom-right" theme={theme as "light" | "dark"} />
    </div>
  );
}

import { logStore } from './lib/stores/logs';

export default function App() {
  const theme = useStore(themeStore);

  useEffect(() => {
    logStore.logSystem('Application initialized', {
      theme,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export const loader = async ({ request, context }: { request: Request; context: any }) => {
  const authCookie = request.headers.get('Cookie')?.match(/bolt_auth=([^;]+)/)?.[1];
  
  if (!authCookie) {
    const url = new URL(request.url);
    if (url.pathname !== '/') {
      return redirect('/');
    }
  }

  return json({});
};
