import moment from "moment";

export const MOCK_DATAMART_SYNCHRONIZATIONS = [
  {
    key: '1',
    start_timestamp: `${moment.utc().subtract(1, 'days').format('MM/DD/YY [03:00:20]')}`,
    end_timestamp: `${moment.utc().subtract(1, 'days').format('MM/DD/YY [03:06:02]')}`,
    hash: "KVC8UCSAYE",
    duration: "349",
    invoked: 'IGUIDEME SYSTEM',
    status: "COMPLETE"
  },
  {
    key: '2',
    start_timestamp: `${moment.utc().format('MM/DD/YY [03:00:20]')}`,
    end_timestamp: `${moment.utc().format('MM/DD/YY [03:06:02]')}`,
    hash: "VQNAXCCISY",
    duration: "372",
    invoked: 'IGUIDEME SYSTEM',
    status: "COMPLETE"
  },
  {
    key: '3',
    start_timestamp: `${moment.utc().subtract(3, 'hours').format('MM/DD/YY [10:27:15]')}`,
    end_timestamp: `${moment.utc().subtract(3, 'hours').add(5, 'minutes').format('MM/DD/YY [10:32:20]')}`,
    hash: "HGKZFP4QT6",
    duration: "291",
    invoked: 'Demo Account',
    status: "Aborted"
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
