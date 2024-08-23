'use client';

import { type ReactElement } from 'react';
import { ThemeProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function NextThemesProvider({ children, ...props }: ThemeProviderProps): ReactElement {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
