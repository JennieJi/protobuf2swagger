const { assert } = require('console');
const path = require('path');
const field2JSON = require('./field2JSON');

function message2JSON(proto, opts) {
  const { fields, comment: description } = proto;
  let required = [];
  const properties = Object.values(fields).reduce((ret, field) => {
    if (!field.optional || field.required) {
      required.push(field.name);
    }
    return {
      ...ret,
      [field.name]: field2JSON(field, opts),
    };
  }, {});
  const ret = {
    type: 'object',
    properties,
  };
  if (required.length) {
    ret.required = required;
  }
  if (description) {
    ret.description = description;
  }
  return ret;
}
module.exports = message2JSON;
