const bakeRef = require('./bakeRef');
const field2JSON = require('./field2JSON');

function type2Parameters(type, paramIn = 'query') {
  return type.fieldsArray.map((field) => {
    const { name, comment, required, typeDefault, repeated } = field;
    let ret = {
      name,
      description: comment || '',
      paramIn,
      required,
    };
    if (field.type === 'string') {
      ret = {
        ...ret,
        ...field2JSON(field),
      };
    } else {
      ret = {
        ...ret,
        type: 'string',
      };
    }
    return ret;
  });
}

function type2BodyParameter(requestType, root) {
  return [
    {
      name: 'body',
      in: 'body',
      required: true,
      description: requestType.comment || '',
      schema: bakeRef(root, requestType.name),
    },
  ];
}

function service2Paths(def, root, { formatServicePath } = {}) {
  const schemas = {};
  const prefix = def.fullName.slice(1);
  Object.values(def.methods).forEach((method) => {
    const options = method.options || {};
    let path = options.path || `/${prefix}/${method.name}`;
    if (formatServicePath) {
      path = formatServicePath(path);
    }
    let parameters = [];
    try {
      const requestType = def.lookupType(method.requestType);
      parameters =
        options.method === 'get'
          ? type2Parameters(requestType)
          : type2BodyParameter(requestType, root);
    } catch (e) {}
    schemas[path] = {
      [options.method || 'post']: {
        operationId: method.fullName.slice(1),
        description: method.comment || '',
        parameters,
        responses: {
          200: {
            description: '',
            schema: bakeRef(root, method.responseType),
          },
        },
      },
    };
  });
  return schemas;
}
module.exports = service2Paths;
