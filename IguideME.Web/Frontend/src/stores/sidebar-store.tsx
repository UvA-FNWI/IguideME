import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SidebarStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      setIsOpen: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
    }),
    {
      partialize: (state) => ({ isOpen: state.isOpen }),
      name: 'isSidebarOpen',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
