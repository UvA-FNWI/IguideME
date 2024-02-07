import { setupHandlers } from "./setup";
import { userHandlers } from "./users";

export const handlers = [...setupHandlers, ...userHandlers];
