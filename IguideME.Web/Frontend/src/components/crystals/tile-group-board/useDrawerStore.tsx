import { create } from 'zustand';
import { type Tile } from '@/types/tile';

interface DrawerStoreProps {
  editTitle: Tile | null;
  setEditTile: (tile: Tile | null) => void;
}

export const useDrawerStore = create<DrawerStoreProps>((set) => ({
  editTitle: null,
  setEditTile: (tile) => set({ editTitle: tile }),
}));
