const protobufjs = require('protobufjs');
const fs = require('fs');
const processPaths = require('./processPaths.js');
const processComponents = require('./processComponents');

const OPENAPI_VERSION = '3.0.0';

async function convert({ file, files, customSchema }) {
  const protobuf = new protobufjs.Root();
  if (file) {
    protobuf.loadSync(file, {
      alternateCommentMode: true,
    });
  }
  if (files) {
    files.forEach((file) => {
      protobuf.loadSync(file, {
        alternateCommentMode: true,
      });
    });
  }
  const { paths: rawPaths, components: rawComponents } = customSchema;
  const schemas = Object.assign(
    processComponents(flattenPath(protobuf.nested)),
    (rawComponents && rawComponents.schemas) || {}
  );
  return {
    ...customSchema,
    openapi: OPENAPI_VERSION,
    paths: processPaths(rawPaths),
    components: {
      ...(rawComponents || {}),
      schemas,
    },
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
