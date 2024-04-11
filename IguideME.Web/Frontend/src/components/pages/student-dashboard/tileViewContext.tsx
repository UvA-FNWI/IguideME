import { createContext, PropsWithChildren, useContext, useRef } from 'react';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createStore, useStore } from 'zustand';
import { type User } from '@/types/user';

type viewType = 'graph' | 'grid';

interface tileViewProps {
  viewType?: viewType;
  user: User;
}

interface tileViewState extends tileViewProps {
  setViewType: (viewType: viewType) => void;
  setUser: (user: User) => void;
}

type tileViewStore = ReturnType<typeof createTileViewStore>;
export const createTileViewStore = (initProps: { user: User; viewType?: viewType }) => {
  const DEFAULT_PROPS = {
    viewType: 'graph' as viewType,
  };

  return createStore<tileViewState>()(
    devtools(
      persist(
        (set) =>
          ({
            ...DEFAULT_PROPS,
            ...initProps,

            setViewType: (viewType) => set({ viewType }),
            setUser: (user) => set({ user }),
          }) satisfies tileViewState,
        {
          name: 'tileViewStore',
          storage: createJSONStorage(() => sessionStorage),
          // only persist viewType. Never save user data in localStorage
          partialize: (state) => ({ viewType: state.viewType }),
        },
      ),
    ),
  );
};

const tileViewContext = createContext<tileViewStore | undefined>(undefined);

type tileViewStoreProviderProps = PropsWithChildren<tileViewProps>;
export function TileViewStoreProvider({ children, ...props }: tileViewStoreProviderProps) {
  const storeRef = useRef<tileViewStore>();
  if (!storeRef.current) {
    storeRef.current = createTileViewStore({ ...props });
  }

  return <tileViewContext.Provider value={storeRef.current}>{children}</tileViewContext.Provider>;
}

export function useTileViewStore<T>(selector: (state: tileViewState) => T): T {
  const store = useContext(tileViewContext);
  if (!store) throw new Error('Missing tileViewContext.Provider in the tree');
  return useStore(store, selector);
}
