import { createContext } from 'react';

export type contextType = 'graph' | 'grid';

export const tileViewContext = createContext<contextType>('graph');

