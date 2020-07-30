const protobufjs = require('protobufjs');
const fs = require('fs');
const path = require('path');
const converter = require('swagger2openapi');
const processComponents = require('./processComponents');
const service2Paths = require('./service2Paths');

async function convert({ files, customSchema = {}, formatServicePath }) {
  const protobuf = new protobufjs.Root();
  if (files) {
    files.forEach((file) => {
      protobuf.loadSync(file, {
        alternateCommentMode: true,
      });
    });
  }
  if (customSchema.swagger) {
    customSchema = converter.convertObj(swagger);
  }
  let { paths, components } = customSchema;

  const flattenedTypes = flattenPath(protobuf.nested);
  Object.values(flattenedTypes).forEach((def) => {
    if (/^Service /.test(def.toString())) {
      paths = {
        ...service2Paths(def, formatServicePath),
        ...(paths || {}),
      };
    }
  });

  return {
    openapi: '3.0.3',
    info: {
      title: protobuf.name || path.basename(files[0], '.proto'),
      description: protobuf.comment,
      verion: '1',
    },
    paths,
    components: {
      schemas: Object.assign(
        processComponents(flattenedTypes),
        (components && components.schemas) || {}
      ),
      ...(components || {}),
    },
    ...customSchema,
  };
}

function flattenPath(protobuf) {
  let flattened = {};
  Object.keys(protobuf).forEach((key) => {
    const val = protobuf[key];
    if (val.nested) {
      Object.entries(flattenPath(val.nested)).forEach(([type, def]) => {
        flattened[`${key}.${type}`] = def;
      });
    } else {
      flattened[key] = val;
    }
  });
  return flattened;
}

module.exports = convert;
