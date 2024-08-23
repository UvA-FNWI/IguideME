import type { ReactElement, ReactNode } from 'react';
import type { Metadata } from 'next';
import { Bitter } from 'next/font/google';

import { setup } from '@/api/setup';
import { getSelf } from '@/api/users';
import { Logo } from '@/components/logo';
import { NavigationLayout } from '@/components/navigation/navigation-layout';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/cn';
import { server } from '@/mocks/workers/server-worker';
import { MswProvider, NextThemesProvider, TanstackQueryProvider } from '@/providers';
import { GlobalStoreProvider } from '@/stores/global-store/use-global-store';
import type { User } from '@/types/user';

import './globals.css';

const bitter = Bitter({ subsets: ['latin'], display: 'swap' });

if (process.env.NEXT_PUBLIC_ENABLE_MOCKING === 'true') server.listen();

export const metadata: Metadata = {
  description: 'I Guide My Education',
  keywords: ['IguideME', 'I Guide My Education', 'student', 'dashboard', 'learning'],
  title: 'IguideME',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<ReactElement> {
  let self: User;
  try {
    await setup();
    self = await getSelf();
  } catch (error) {
    return (
      <html lang='en'>
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <body
          className={cn(
            bitter.className,
            'flex h-screen w-screen flex-col flex-wrap items-center justify-center gap-8',
          )}
        >
          <div className='flex items-center justify-center'>
            <Logo />
            <h1 className='text-2xl'>Failed to setup application</h1>
          </div>
          <p className='text-lg text-muted-foreground'>Please try again later</p>
        </body>
      </html>
    );
  }

  return (
    <html lang='en' suppressHydrationWarning>
      <link rel='icon' href='/favicon.ico' sizes='any' />
      <body className={bitter.className}>
        <TanstackQueryProvider>
          <MswProvider>
            <NextThemesProvider
              attribute='class'
              defaultTheme='light'
              disableTransitionOnChange
              enableSystem
              themes={['light', 'dark']}
            >
              <GlobalStoreProvider self={self}>
                <NavigationLayout>{children}</NavigationLayout>
                <Toaster />
              </GlobalStoreProvider>
            </NextThemesProvider>
          </MswProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
