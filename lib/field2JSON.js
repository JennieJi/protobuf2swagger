const bakeRef = require('./bakeRef');

const API_TYPES = {
  number: 'number',
  boolean: 'boolean',
  string: 'string',
};

const TYPE_MAPPING = {
  double: API_TYPES.string,
  float: API_TYPES.number,
  int32: API_TYPES.number,
  int64: API_TYPES.string,
  uint32: API_TYPES.number,
  uint64: API_TYPES.string,
  sint32: API_TYPES.number,
  sint64: API_TYPES.string,
  fixed32: API_TYPES.number,
  fixed64: API_TYPES.string,
  sfixed32: API_TYPES.number,
  sfixed64: API_TYPES.string,
  bool: API_TYPES.boolean,
  string: API_TYPES.string,
  bytes: API_TYPES.string,
};

const FORMATS = {
  int32: 'int32',
  int64: 'int64',
  float: 'float',
  double: 'double',
  byte: 'byte',
  binary: 'binary',
};
const FORMAT_MAPPING = {
  double: FORMATS.double,
  float: FORMATS.float,
  int32: FORMATS.int32,
  int64: FORMATS.int64,
  uint32: FORMATS.int32,
  uint64: FORMATS.int64,
  sint32: FORMATS.int32,
  sint64: FORMATS.int64,
  fixed32: FORMATS.int32,
  fixed64: FORMATS.int64,
  sfixed32: FORMATS.int32,
  sfixed64: FORMATS.int64,
  bytes: FORMATS.byte,
};

function field2JSON({
  type,
  comment: description,
  repeated,
  typeDefault,
  root,
}) {
  let schema = {};
  const mappedType = TYPE_MAPPING[type];
  if (mappedType) {
    schema.type = mappedType;
    schema.format = FORMAT_MAPPING[type] || '';
    schema.default = typeDefault;
  } else {
    const { lookupEnum, lookupType } = root;
    try {
      const enumDef = lookupEnum(type);
      schema.enum = Object.values(enumDef);
    } catch (e) {
      schema = bakeRef(root, type);
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
