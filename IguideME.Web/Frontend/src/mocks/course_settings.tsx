import { http, HttpResponse } from "msw";

export const courseSettingsHandlers = [
  http.get("app/peer-groups", () => {
    return HttpResponse.json({ min_size: 5, personalized_peers: true });
  }),
  http.post("app/notifications", () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
