import { courseSettingsHandlers } from "./course_settings";
import { entriesHandlers } from "./entries";
import { gradeHandlers } from "./grades";
import { notificationsHandlers } from "./notifications";
import { setupHandlers } from "./setup";
import { syncingHandlers } from "./syncing";
import { tileHandlers } from "./tiles";
import { userHandlers } from "./users";

export const handlers = [
  ...setupHandlers,
  ...userHandlers,
  ...syncingHandlers,
  ...courseSettingsHandlers,
  ...tileHandlers,
  ...entriesHandlers,
  ...gradeHandlers,
  ...notificationsHandlers,
];
