import { http, HttpResponse } from "msw";

export const setupHandlers = [
  http.post("app/setup", () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
