import moment from "moment";

export const MOCK_DATAMART_SYNCHRONIZATIONS = [
  {
    key: '1',
    start_timestamp: 1684499453123,
    end_timestamp: 1684499553123,
    invoked: 'IGUIDEME SYSTEM',
    status: "COMPLETE"
  },
  {
    key: '2',
    start_timestamp: 1684459453123,
    end_timestamp: 1684459653123,
    invoked: 'IGUIDEME SYSTEM',
    status: "COMPLETE"
  },
  {
    key: '3',
    start_timestamp: 1684359453213,
    end_timestamp: null,
    invoked: 'Demo Account',
    status: "INCOMPLETE"
  }
]

export const MOCK_DATAMART_STATUS_BUSY = {
  '7fefbad3-54ac-4d32-a4db-6991d3e55f6f': {
    jobId: '7fefbad3-54ac-4d32-a4db-6991d3e55f6f',
    jobResult: { calculatedResult: null, exception: null },
    lastUpdate: `${moment.utc().format("YYYY-MM-DD")}T21:48:59.619771Z`,
    progressPercentage: 1,
    progressInformation: "tasks.assignments",
    startTime: `${moment.utc().format("YYYY-MM-DD")}T${moment.utc().format("HH:mm:ss")}.000000Z`,
    status: 2,
    workParameters: { iterations: 0, seedData: 0 }
  },
}

export const MOCK_DATAMART_STATUS_EMPTY = {}
