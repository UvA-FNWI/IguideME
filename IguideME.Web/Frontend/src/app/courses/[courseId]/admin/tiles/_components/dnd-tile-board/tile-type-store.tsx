'use client';

import { createContext, type PropsWithChildren, type ReactElement, useContext, useRef } from 'react';
import { createStore, type StoreApi,useStore } from 'zustand';

import { TileType } from '@/types/tile';

interface TileTypeProps {
  tileType: TileType;
}

interface TileTypeState extends TileTypeProps {
  setTileType: (tileType: TileType) => void;
}

type TileTypeStore = ReturnType<typeof createTileTypeStore>;
const createTileTypeStore = (initProps?: Partial<TileTypeProps>): StoreApi<TileTypeState> => {
  return createStore<TileTypeState>()((set) => ({
    tileType: TileType.Assignments,
    setTileType: (tileType) => {
      set({ tileType });
    },
    ...initProps,
  }));
};

const TileTypeContext = createContext<TileTypeStore | null>(null);
function useTileTypeContext<T>(selector: (state: TileTypeState) => T): T {
  const store = useContext(TileTypeContext);
  if (!store) throw new Error('Missing TileTypeContext.Provider in the tree');
  return useStore(store, selector);
}

type BearProviderProps = PropsWithChildren<TileTypeProps>;
function TileTypeProvider({ children, ...props }: BearProviderProps): ReactElement {
  const storeRef = useRef<TileTypeStore>();
  if (!storeRef.current) {
    storeRef.current = createTileTypeStore(props);
  }
  return <TileTypeContext.Provider value={storeRef.current}>{children}</TileTypeContext.Provider>;
}

export { TileTypeProvider, useTileTypeContext };
