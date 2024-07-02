import { analyticsHandlers } from './analytics';
import { courseSettingsHandlers } from './course_settings';
import { courseHandlers } from './courses';
import { entriesHandlers } from './entries';
import { gradeHandlers } from './grades';
import { notificationsHandlers } from './notifications';
import { setupHandlers } from './setup';
import { syncingHandlers } from './syncing';
import { tileHandlers } from './tiles';
import { userHandlers } from './users';

export const handlers = [
  ...analyticsHandlers,
  ...courseHandlers,
  ...courseSettingsHandlers,
  ...entriesHandlers,
  ...gradeHandlers,
  ...notificationsHandlers,
  ...setupHandlers,
  ...syncingHandlers,
  ...tileHandlers,
  ...userHandlers,
];
