const API_TYPES = {
  number: 'number',
  boolean: 'boolean',
  string: 'string'
};

// TODO: find mapping in protobuf.js for jsdoc
const MAPPING = {
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
  bytes: API_TYPES.string
};

function mapType(type) {
  return MAPPING[type];
};

module.exports = mapType;