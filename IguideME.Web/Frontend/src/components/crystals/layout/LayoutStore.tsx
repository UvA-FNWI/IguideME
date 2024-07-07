import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LayoutStore {
  isSidebarClosed: boolean;
  toggleSidebar: () => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      isSidebarClosed: window.innerWidth < 768,
      toggleSidebar: () => {
        set((state) => ({ isSidebarClosed: !state.isSidebarClosed }));
      },
    }),
    {
      partialize: (state) => ({ isSidebarClosed: state.isSidebarClosed }),
      name: 'viewMode',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
