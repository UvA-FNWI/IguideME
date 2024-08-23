import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ViewType } from '@/types/tile';

interface TileViewStore {
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
}

export const useTileViewStore = create<TileViewStore>()(
  persist(
    (set) => ({
      viewType: 'graph',
      setViewType: (viewType) => {
        set({ viewType });
      },
    }),
    {
      partialize: (state) => ({ viewType: state.viewType }),
      name: 'view-type',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
