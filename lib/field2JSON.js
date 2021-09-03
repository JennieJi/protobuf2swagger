const bakeRef = require("./bakeRef");

const API_TYPES = {
  integer: "integer",
  number: "number",
  boolean: "boolean",
  string: "string",
};

const FORMATS = {
  int32: "int32",
  int64: "int64",
  float: "float",
  double: "double",
  byte: "byte",
  binary: "binary",
};

const TYPE_MAPPING = {
  double: {
    type: API_TYPES.string,
    format: FORMATS.double,
  },
  float: {
    type: API_TYPES.number,
    format: FORMATS.float,
  },
  int32: {
    type: API_TYPES.integer,
    format: FORMATS.int32,
  },
  int64: {
    type: API_TYPES.string,
    format: FORMATS.int64,
  },
  uint32: {
    type: API_TYPES.integer,
    format: FORMATS.int32,
  },
  uint64: {
    type: API_TYPES.string,
    format: FORMATS.int64,
  },
  sint32: {
    type: API_TYPES.integer,
    format: FORMATS.int32,
  },
  sint64: {
    type: API_TYPES.string,
    format: FORMATS.int64,
  },
  fixed32: {
    type: API_TYPES.integer,
    format: FORMATS.int32,
  },
  fixed64: {
    type: API_TYPES.string,
    format: FORMATS.int64,
  },
  sfixed32: {
    type: API_TYPES.integer,
    format: FORMATS.int64,
  },
  sfixed64: {
    type: API_TYPES.string,
    format: FORMATS.int64,
  },
  bool: {
    type: API_TYPES.boolean,
  },
  string: {
    type: API_TYPES.string,
  },
  bytes: {
    type: API_TYPES.string,
    format: FORMATS.byte,
  },
};

function field2JSON(
  { type, comment: description, repeated, typeDefault, root },
  { long } = {}
) {
  let schema = {};
  const mappedType = TYPE_MAPPING[type];
  if (mappedType) {
    schema = {
      ...mappedType,
    };
    if (typeDefault !== undefined && typeDefault !== null) {
      schema.default = typeDefault;
    }
    if (schema.format === FORMATS.int64 && long === "number") {
      schema.type = API_TYPES.integer;
    }
    if (schema.format === FORMATS.double && long === "number") {
      schema.type = API_TYPES.number;
    }
  } else {
    const { lookupEnum, lookupType } = root;
    try {
      const enumDef = lookupEnum(type);
      schema.enum = Object.values(enumDef);
    } catch (e) {
      schema = bakeRef(root, type);
    }
  }

  if (repeated) {
    schema = {
      type: "array",
      items: schema,
    };
  }
  if (description) {
    schema.description = description;
  }

  return schema;
}

module.exports = field2JSON;
