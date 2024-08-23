import type { LayoutColumn } from '@/types/layout';

export const MOCK_COLUMNS: LayoutColumn[] = [
  {
    id: 1,
    width: 30,
    position: 0,
    groups: [2, 3],
  },
  {
    id: 2,
    width: 70,
    position: 1,
    groups: [1],
  },
];
