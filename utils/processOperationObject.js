const bakeRef = require('./bakeRef');

const JSON_META_TYPE = 'application/json';
const HTML_META_TYPE = 'text/html';

function processOperationObject(obj) {
  const ret = { ...obj };
  // parameters
  if (obj && Array.isArray(obj.parameters)) {
    obj.parameters.forEach(({ $proto }, i) => {
      if (!$proto) { return; }
      ret.parameters[i] = {
        $ref: bakeRef($proto)
      };
    });
  }
  // requestBody
  const reqProto = obj && obj.requestBody && obj.requestBody.$proto;
  if (reqProto) {
    ret.requestBody = bakeContent(reqProto);
  }
  // responses
  const resProto = obj && obj.responses && obj.responses.$proto;
  if (resProto) {
    ret.responses = {
      '200': bakeContent(resProto),
    };
  }
  return ret;
}

function bakeContent(protobufName) {
  return {
    content: {
      [JSON_META_TYPE]: {
        schema: {
          $ref: bakeRef(protobufName)
        }
      }
    }
  };
}

module.exports = processOperationObject;