const protobuf = require('protobufjs');
const fs = require('fs');
const processPaths = require('./processPaths.js');
const processComponents = require('./processComponents');

const OPENAPI_VERSION = '3.0.0';

async function convert({
  file,
  customSchema
}) {
  // TODO: custom schema validate
  const rootProto = await protobuf.parse(fs.readFileSync(file).toString(), {
    alternateCommentMode: true
  });
  const { paths: rawPaths, components: rawComponents } = customSchema;
  return {
    ...customSchema,
    openapi: OPENAPI_VERSION,
    paths: processPaths(rawPaths),
    components: {
      ...(rawComponents || {}),
      schemas: {
        ...processComponents(getProtoByPath(rootProto)),
        ...(rawComponents || {}).schemas,
      }
    }
  };
}

function getProtoByPath(proto) {
  return proto.package
    .split('.')
    .reduce((data, path) => data.get(path), proto.root)
      .nested;
}

module.exports = convert;