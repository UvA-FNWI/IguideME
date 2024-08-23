import { createStore, type StoreApi } from 'zustand';

import type { Course } from '@/types/course';
import { type User } from '@/types/user';

interface GlobalProps {
  course?: Course;
  self: User;
  student?: User;
}

type GlobalState = {
  changeCourse: (course?: Course) => void;
  changeUser: (user: User) => void;
  changeStudent: (student?: User) => void;
} & GlobalProps;

type GlobalStore = ReturnType<typeof createGlobalStore>;
function createGlobalStore(initProps: GlobalProps): StoreApi<GlobalState> {
  return createStore<GlobalState>((set) => ({
    ...initProps,
    changeCourse: (course) => {
      set({ course });
    },
    changeUser: (user) => {
      set({ self: user });
    },
    changeStudent: (student) => {
      set({ student });
    },
  }));
}

export type { GlobalProps, GlobalState, GlobalStore };
export { createGlobalStore };
