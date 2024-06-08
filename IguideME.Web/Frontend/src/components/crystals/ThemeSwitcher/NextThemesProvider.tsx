import { ThemeProvider } from 'next-themes';
import { memo, type ReactElement } from 'react';
import { type ThemeProviderProps } from 'next-themes/dist/types';

function NextThemesProvider({ children, ...props }: ThemeProviderProps): ReactElement {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}

const MemoizedNextThemesProvider = memo(NextThemesProvider);
export default MemoizedNextThemesProvider;
