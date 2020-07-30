const mapType = require('./mapType');
const bakeRef = require('./bakeRef');

function field2JSON({
  type,
  comment: description,
  repeated,
  typeDefault,
  root,
}) {
  const schema = {};
  const mappedType = mapType(type);
  if (mappedType) {
    schema.type = mappedType;
    schema.format = '';
    schema.default = typeDefault;
  } else {
    const { lookupEnum, lookupType } = root;
    try {
      const enumDef = lookupEnum(type);
      schema.enum = Object.values(enumDef);
    } catch (e) {
      schema.$ref = bakeRef(type);
    }
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
