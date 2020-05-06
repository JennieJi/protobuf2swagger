const bakeRef = require('./bakeRef');

const JSON_META_TYPE = 'application/json';
const HTML_META_TYPE = 'text/html';

function processOperationObject(obj, schemas) {
  const ret = { ...obj };
  // params
  let paramsProto = obj && obj.parameters && obj.parameters.$proto;
  if (paramsProto) {
    let excludes;
    if (typeof paramsProto !== 'string') {
      excludes = paramsProto.excludes;
      paramsProto = paramsProto.message;
    }
    const paramsSchema = schemas[paramsProto];
    if (paramsSchema && paramsSchema.properties) {
      ret.parameters = Object.keys(paramsSchema.properties)
        .map((param) => {
          if (excludes && excludes.includes(param)) {
            return;
          }
          const originSchema = paramsSchema.properties[param];
          const paramSchema = {
            name: param,
            description: originSchema.description,
            in: 'query',
            schema: originSchema,
          };
          return paramSchema;
        })
        .filter((s) => !!s);
    }
  }

  // requestBody
  let reqProto = obj && obj.requestBody && obj.requestBody.$proto;
  if (reqProto) {
    let excludes;
    if (typeof reqProto !== 'string') {
      excludes = reqProto.excludes;
      reqProto = reqProto.message;
    }
    ret.requestBody = { $ref: reqProto };
  }

  // responses
  let resProto = obj && obj.responses && obj.responses.$proto;
  if (resProto) {
    let excludes;
    if (typeof resProto !== 'string') {
      excludes = resProto.excludes;
      resProto = resProto.message;
    }
    ret.responses = {
      '200': {
        content: {
          [JSON_META_TYPE]: {
            schema: {
              $ref: bakeRef(resProto),
            },
          },
        },
      },
    };
  }
  return ret;
}
module.exports = processOperationObject;
