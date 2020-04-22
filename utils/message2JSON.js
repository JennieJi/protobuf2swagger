const field2JSON = require('./field2JSON.js');

function messageToJSON(proto) {
  const { fields, comment: description } = proto;
  let required = [];
  const properties = Object.keys(fields).reduce((ret, field) => {
    const fieldDef = fields[field];
    const { optional, required } = fieldDef;
    if (!optional || required) {
      required.push(field);
    }
    return {
      ...ret,
      [field]: field2JSON(fieldDef),
    };
  }, {});
  return {
    type: 'object',
    properties,
    required,
    description,
  };
}
module.exports = messageToJSON;
