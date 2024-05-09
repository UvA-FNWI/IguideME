import { type Tile } from '@/types/tile';
import { create } from 'zustand';

interface DrawerStoreProps {
  isChanged: boolean;
  setIsChanged: (changed: boolean) => void;

  editTitle: Tile | null;
  setEditTile: (tile: Tile | null) => void;
}

export const useDrawerStore = create<DrawerStoreProps>((set) => ({
  isChanged: false,
  setIsChanged: (changed) => set({ isChanged: changed }),

  editTitle: null,
  setEditTile: (tile) => set({ editTitle: tile }),
}));
