const protobufjs = require('protobufjs');
const fs = require('fs');
const path = require('path');
const { convertObj: swagger2openapi } = require('swagger2openapi');
const service2Paths = require('./service2Paths');
const message2JSON = require('./message2JSON');
const enum2JSON = require('./enum2JSON');
const { config } = require('process');

async function convert({ files, customSchema = {}, formatServicePath, long }) {
  const protobuf = new protobufjs.Root();
  if (files) {
    files.forEach((file) => {
      protobuf.loadSync(file, {
        alternateCommentMode: true,
        keepCase: true,
      });
    });
  }
  const definitions = {};
  const paths = {};
  let processQueue = [protobuf];
  let def;
  while ((def = processQueue.shift())) {
    const key = def.fullName.replace(/^\./, '');
    if (/^Enum /.test(def.toString())) {
      definitions[key] = enum2JSON(def);
    } else {
      if (def.fields) {
        definitions[key] = message2JSON(def, {
          long,
        });
      }
      if (def.methods) {
        Object.assign(paths, service2Paths(protobuf, def, formatServicePath));
      }
      if (def.nested) {
        processQueue = processQueue.concat(Object.values(def.nested));
      }
    }
  }
  const result = {
    swagger: '2.0',
    info: customSchema.info || {
      title: protobuf.name || path.basename(files[0], '.proto'),
      description: protobuf.comment || '',
      version: '1',
    },
    paths,
    definitions,
  };

  if (customSchema.swagger) {
    return {
      ...result,
      ...customSchema,
      paths: Object.assign(result.paths, customSchema.paths),
      definitions: Object.assign(result.definitions, customSchema.definitions),
    };
  }
  const { openapi } = await swagger2openapi(result, {
    resolve: false,
  });
  return {
    ...openapi,
    ...customSchema,
    paths: Object.assign(openapi.paths, customSchema.paths),
    components: {
      ...openapi.components,
      ...(customSchema.components || {}),
      schemas: Object.assign(
        {},
        openapi.components && openapi.components.schemas,
        customSchema.components && customSchema.components.schemas
      ),
    },
  };
}

module.exports = convert;
