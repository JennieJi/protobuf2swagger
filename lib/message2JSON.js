const field2JSON = require('./field2JSON.js');

function messageToJSON(proto) {
  const { fields, comment: description } = proto;
  let required = [];
  const properties = Object.values(fields).reduce((ret, field) => {
    const { optional, required } = field;
    if (!optional || required) {
      required.push(field);
    }
    return {
      ...ret,
      [field.name]: field2JSON(field),
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
