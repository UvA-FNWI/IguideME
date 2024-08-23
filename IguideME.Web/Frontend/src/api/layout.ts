import type { LayoutColumn } from '@/types/layout';

import { apiClient } from './axios';

async function getLayoutColumns(): Promise<LayoutColumn[]> {
  const response = await apiClient.get('api/layout/column');
  return response.data as LayoutColumn[];
}

async function postLayoutColumns(layouts: LayoutColumn[]): Promise<void> {
  await apiClient.post('api/layout/column', layouts);
}

export { getLayoutColumns, postLayoutColumns };
