import setup from '@/api/setup.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import NextThemesProvider from './components/crystals/ThemeSwitcher/NextThemesProvider.tsx';
import './globals.css';
import { createRouter } from './router.tsx';
import { App } from 'antd';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

async function enableMocking(): Promise<ServiceWorkerRegistration | undefined> {
  if (import.meta.env.MODE !== 'mock') {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return await worker.start({
    // This is going to perform unhandled requests
    // but print no warning whatsoever when they happen.
    onUnhandledRequest: 'bypass',
  });
}

enableMocking()
  .then(async () => {
    // Sets up the backend (registers the course if the course hasn't been registered yet).
    return await setup();
  })
  .then(
    () => {
      // Routing for the frontend. This is separate from the routing on the backend.
      const rootElement = document.getElementById('root');
      if (rootElement) {
        const AppContent = (
          <QueryClientProvider client={queryClient}>
            <NextThemesProvider
              attribute='class'
              defaultTheme='light'
              disableTransitionOnChange
              enableSystem
              themes={['light', 'dark']}
            >
              <App
                message={{
                  duration: 0,
                  maxCount: 3,
                }}
              >
                <RouterProvider router={createRouter()} />
              </App>
            </NextThemesProvider>
            {import.meta.env.MODE === 'mock' && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        );

        ReactDOM.createRoot(rootElement).render(
          import.meta.env.MODE !== 'production' ? <StrictMode>{AppContent}</StrictMode> : AppContent,
        );
      } else {
        console.error('Root element not found');
      }
    },
    (error) => {
      console.error('Setup unsuccessful', error);
    },
  );
