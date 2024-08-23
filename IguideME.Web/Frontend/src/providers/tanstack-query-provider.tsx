'use client';

// This file is a provider for Tanstack Query. It originates from the Tanstack Query documentation:
// https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr.

import type { ReactElement } from 'react';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();

  if (!browserQueryClient) browserQueryClient = makeQueryClient();

  return browserQueryClient;
}

export function TanstackQueryProvider({ children }: { children: ReactElement }): ReactElement {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
