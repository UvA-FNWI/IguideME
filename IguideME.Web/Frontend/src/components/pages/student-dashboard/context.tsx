import { type User } from '@/types/user';
import { createContext } from 'react';

export type viewType = 'graph' | 'grid';
export interface contextType {
  viewType: viewType;
  user?: User;
}

export const tileViewContext = createContext<contextType>({
  viewType: 'graph',
  user: undefined,
});
