const processOperationObject = require('./processOperationObject.js');

const OPERATIONS = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'path',
  'trace',
];

function processPaths(paths, schemas) {
  return Object.keys(paths).reduce((updatedPaths, route) => {
    const raw = paths[route];
    const { operationId, summary } = raw;
    const updatedRoute = OPERATIONS.reduce((ret, operation) => {
      const rawOperation = raw[operation];
      return rawOperation
        ? {
            ...ret,
            [operation]: processOperationObject(rawOperation, schemas),
          }
        : ret;
    }, {});
    if (!operationId) {
      updatedRoute.operationId = route;
    }
    if (!summary) {
      updatedRoute.summary = '';
    }
    return {
      ...updatedPaths,
      [route]: updatedRoute,
    };
  }, paths);
}

module.exports = processPaths;
