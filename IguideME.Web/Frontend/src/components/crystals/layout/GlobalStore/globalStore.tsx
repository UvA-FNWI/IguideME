import { User } from '@/types/user';
import { createContext, memo, useRef, type FC, type PropsWithChildren } from 'react';
import { createStore } from 'zustand';

type GlobalProps = {
  self: User;
};

export type GlobalState = {
  changeUser: (user: User) => void;
} & GlobalProps;

type GlobalStore = ReturnType<typeof createGlobalStore>;
const createGlobalStore = (initProps: GlobalProps) => {
  return createStore<GlobalState>((set) => ({
    ...initProps,
    changeUser: (user) => set({ self: user }),
  }));
};

export const GlobalContext = createContext<GlobalStore | null>(null);

type GlobalStoreProviderProps = PropsWithChildren<GlobalProps>;
const GlobalStoreProvider: FC<GlobalStoreProviderProps> = memo(({ children, ...props }) => {
  const storeRef = useRef<GlobalStore>();
  if (!storeRef.current) storeRef.current = createGlobalStore(props);

  return <GlobalContext.Provider value={storeRef.current}>{children}</GlobalContext.Provider>;
});
GlobalStoreProvider.displayName = 'GlobalStoreProvider';
export default GlobalStoreProvider;
