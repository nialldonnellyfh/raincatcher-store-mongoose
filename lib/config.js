module.exports= {
  module: 'raincatcher-mongo-connector',
  datasetIDs: {
    WORKORDERS: 'workorders',
    WORKFLOW: 'workflows',
    FILE: 'file',
    GPS: 'gps',
    MESSAGES: 'messages',
    RESULT: 'result'
  },
  modelLabels: {
    WORKORDERS: 'Workorder',
    WORKFLOW: 'Workflow',
    FILE: 'File',
    GPS: 'gps',
    MESSAGES: 'Message',
    RESULT: 'result'
  },
  test: {
    mongoUri: 'mongodb://localhost:27017/raincatcher-mongo-connector'
  }
};