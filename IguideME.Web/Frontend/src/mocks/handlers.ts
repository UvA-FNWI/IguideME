import { courseSettingsHandlers } from "./course_settings";
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
];
