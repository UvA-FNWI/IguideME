import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';
import type { LayoutColumn } from '@/types/layout';

import { MOCK_COLUMNS } from './layout-example-data';

export const layoutHandlers = [
  http.get(basePath('api/layout/column'), () => {
    return HttpResponse.json<LayoutColumn[]>(MOCK_COLUMNS);
  }),

  http.post(basePath('api/layout/column'), async ({ request }) => {
    const newColumns = await request.json();
    MOCK_COLUMNS.push(...(newColumns as LayoutColumn[]));
    return HttpResponse.json(newColumns, { status: 201 });
  }),
];
