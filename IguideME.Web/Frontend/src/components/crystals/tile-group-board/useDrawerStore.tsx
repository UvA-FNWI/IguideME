import { create } from 'zustand';
import { type Tile } from '@/types/tile';

interface DrawerStoreProps {
  isChanged: boolean;
  setIsChanged: (changed: boolean) => void;

  editTitle: Tile | null;
  setEditTile: (tile: Tile | null) => void;
}

export const useDrawerStore = create<DrawerStoreProps>((set) => ({
  isChanged: false,
  setIsChanged: (changed) => {
    set({ isChanged: changed });
  },

  editTitle: null,
  setEditTile: (tile) => {
    set({ editTitle: tile });
  },
}));
