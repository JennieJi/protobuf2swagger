const mapType = require('./mapType');
const bakeRef = require('./bakeRef');

function field2JSON({ message, type, comment: description, repeated }) {
  const mappedType = mapType(type);
  let schema;
  if (mappedType) {
    schema = {
      type: mappedType,
      description,
    };
  } else {
    let parent = message;
    while ((parent = parent.parent) && parent.name) {
      type = `${parent.name}.${type}`;
    }
    schema = {
      $ref: bakeRef(type),
    };
  }

  return repeated
    ? {
        type: 'array',
        items: schema,
        description,
      }
    : schema;
}

module.exports = field2JSON;
