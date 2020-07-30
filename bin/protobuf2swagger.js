#!/usr/bin/env node
'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');
const fs = require('fs');
const convert = require('../lib/convert.js');

program
  .version(pkg.version, '-v --version')
  .arguments('[config_file]')
  .usage('[config_file]')
  .on('--help', () => {
    console.log('\n');
    console.log(
      'config_file  Customize configuration file. Default to protobuf2swagger.config.js under current folder.'
    );
  })
  .parse(process.argv);

const [configPath] = program.args;
const cwd = process.cwd();
const DEFAULT_CONFIG_PATH = 'protobuf2swagger.config.js';
const config = require(path.resolve(cwd, configPath || DEFAULT_CONFIG_PATH));
if (config.file) {
  config.files = config.files ? [config.file, ...config.files] : [config.file];
}

(async () => {
  const content = await convert(config);
  const dist = config.dist ? path.resolve(cwd, config.dist) : cwd;
  fs.writeFileSync(dist, JSON.stringify(content, null, 2));
  console.info('Converted schema written into ', dist);
})();
