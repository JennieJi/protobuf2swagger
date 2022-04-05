const bakeRef = require('./bakeRef');

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
        ...field2JSON(type),
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

function service2Paths(root, def, formatServicePath) {
  const schemas = {};
  Object.values(def.methods).forEach((method) => {
    const options = method.options || {};
    let path = options.path || `/${def.fullName.slice(1)}/${method.name}`;
    if (formatServicePath) {
      path = formatServicePath(path);
    }
    let parameters = [];
    try {
      const requestType = def.lookupType(method.requestType);
      if (options.method === 'get') {
        parameters = type2Parameters(requestType);
      } else { 
        parameters = [{
          name: 'body',
          in: 'body',
          required: true,
          description: requestType.comment || '',
          schema: bakeRef(root, requestType.name),
        }];
      }
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
