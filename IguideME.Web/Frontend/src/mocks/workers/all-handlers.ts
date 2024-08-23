import { analyticsHandlers } from '@/mocks/analytic/analytic-handlers';
import { courseHandlers } from '@/mocks/course/course-handlers';
import { courseSettingHandlers } from '@/mocks/course-setting/course-setting-handlers';
import { entryHandlers } from '@/mocks/entry/entry-handlers';
import { layoutHandlers } from '@/mocks/layout/layout-handlers';
import { notificationHandlers } from '@/mocks/notification/notification-handlers';
import { setupHandlers } from '@/mocks/setup/setup-handlers';
import { syncHandlers } from '@/mocks/sync/sync-handlers';
import { tileHandlers } from '@/mocks/tile/tile-handlers';
import { userHandlers } from '@/mocks/user/user-handlers';

export const handlers = [
  ...analyticsHandlers,
  ...courseHandlers,
  ...courseSettingHandlers,
  ...entryHandlers,
  ...layoutHandlers,
  ...notificationHandlers,
  ...setupHandlers,
  ...syncHandlers,
  ...tileHandlers,
  ...userHandlers,
];
