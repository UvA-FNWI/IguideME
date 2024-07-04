import setup from '@/api/setup.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import NextThemesProvider from './components/crystals/ThemeSwitcher/NextThemesProvider.tsx';
import './globals.css';
import { createRouter } from './router.tsx';

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
      // Routes that end with /> are endpoints but routes that have other routes listed before </Route>
      // will have those routes render within an Outlet component.
      ReactDOM.createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <QueryClientProvider client={queryClient}>
            <NextThemesProvider
              attribute='class'
              defaultTheme='light'
              disableTransitionOnChange
              enableSystem
              themes={['light', 'dark']}
            >
              <RouterProvider router={createRouter()} />
            </NextThemesProvider>
            {import.meta.env.MODE === 'mock' && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </StrictMode>,
      );
    },
    () => {
      console.error('Setup unsuccesful');
    },
  );
