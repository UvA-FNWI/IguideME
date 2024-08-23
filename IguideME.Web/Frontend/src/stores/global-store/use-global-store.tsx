'use client';

import { createContext, type PropsWithChildren, type ReactElement, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { createGlobalStore, type GlobalProps, type GlobalState, type GlobalStore } from './global-store';

const GlobalContext = createContext<GlobalStore | null>(null);

type GlobalStoreProviderProps = PropsWithChildren<GlobalProps>;
function GlobalStoreProvider({ children, ...props }: GlobalStoreProviderProps): ReactElement {
  const storeRef = useRef<GlobalStore>();
  if (!storeRef.current) storeRef.current = createGlobalStore(props);

  return <GlobalContext.Provider value={storeRef.current}>{children}</GlobalContext.Provider>;
}

function useGlobalContext<T>(selector: (state: GlobalState) => T): T {
  const store = useContext(GlobalContext);
  if (!store) throw new Error('useGlobalContext must be used within a GlobalStoreProvider');
  return useStore(store, selector);
}

export { GlobalStoreProvider, useGlobalContext };
