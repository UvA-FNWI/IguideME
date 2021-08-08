import moment from "moment";

export const MOCK_DATAMART_SYNCHRONIZATIONS = [
  {
    key: '1',
    start: `${moment.utc().subtract(1, 'days').format('MMMM Do[,] YYYY [at 03:00 AM]')}`,
    end: `${moment.utc().subtract(1, 'days').format('MMMM Do[,] YYYY [at 03:06 AM]')}`,
    hash: "KVC8UCSAYE",
    duration: "00:05:49",
    invoked: 'IGUIDEME SYSTEM',
    status: "Success"
  },
  {
    key: '2',
    start: `${moment.utc().format('MMMM Do[,] YYYY [at 03:00 AM]')}`,
    end: `${moment.utc().format('MMMM Do[,] YYYY [at 03:06 AM]')}`,
    hash: "VQNAXCCISY",
    duration: "00:06:12",
    invoked: 'IGUIDEME SYSTEM',
    status: "Success"
  },
  {
    key: '3',
    start: `${moment.utc().subtract(3, 'hours').format('MMMM Do[,] YYYY [at] LT')}`,
    end: `${moment.utc().subtract(3, 'hours').add(5, 'minutes').format('MMMM Do[,] YYYY [at] LT')}`,
    hash: "HGKZFP4QT6",
    duration: "00:04:51",
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
