import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type LayoutStore = {
  isSidebarClosed: boolean;
  toggleSidebar: () => void;
};

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      isSidebarClosed: false,
      toggleSidebar: () => set((state) => ({ isSidebarClosed: !state.isSidebarClosed })),
    }),
    {
      partialize: (state) => ({ sidebarOpen: state.isSidebarClosed }),
      name: 'viewMode',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
