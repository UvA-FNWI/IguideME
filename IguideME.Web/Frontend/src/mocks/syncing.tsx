import { type Synchronization } from "@/types/synchronization";
import { http, HttpResponse } from "msw";

export const syncingHandlers = [
  http.get("/datamart/synchronizations", () => {
    return HttpResponse.json<Synchronization[]>(MOCK_SYNCHRONIZATIONS);
  }),
  http.get("/datamart/status", () => {
    return HttpResponse.json({});
  }),
  http.post("/datamart/start-sync", () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post("/datamart/stop-sync", () => {
    return new HttpResponse(null, { status: 200 });
  }),
];

const MOCK_SYNCHRONIZATIONS: Synchronization[] = [
  {
    start_timestamp: 1684499453123,
    end_timestamp: 1684499553123,
    invoked: "IGUIDEME SYSTEM",
    status: "COMPLETE",
  },
  {
    start_timestamp: 1684459453123,
    end_timestamp: 1684459653123,
    invoked: "IGUIDEME SYSTEM",
    status: "COMPLETE",
  },
  {
    start_timestamp: 1684359453213,
    end_timestamp: null,
    invoked: "Demo Account",
    status: "INCOMPLETE",
  },
];
