const mapType = require('./mapType');
const bakeRef = require('./bakeRef');

function field2JSON ({
  type,
  comment: description,
  repeated,
}) {
  const mappedType = mapType(type);
  const schema = mappedType ? {
    type: mappedType,
    description
  } : {
    $ref: bakeRef(type)
  };

  return repeated ? {
    type: 'array',
    items: schema,
    description
  } : schema;
}

module.exports = field2JSON;