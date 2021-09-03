const field2JSON = require("./field2JSON.js");

function message2JSON(proto, opts) {
  const { fields, comment: description } = proto;
  let required = [];
  const properties = Object.values(fields).reduce((ret, field) => {
    const { optional, required } = field;
    if (!optional || required) {
      required.push(field);
    }
    return {
      ...ret,
      [field.name]: field2JSON(field, opts),
    };
  }, {});
  const ret = {
    type: "object",
    properties,
    required,
  };
  if (description) {
    ret.description = description;
  }
  return ret;
}
module.exports = message2JSON;
