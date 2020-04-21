#!/usr/bin/env node
'use strict';

const path = require('path');
const program = require('commander');
const fs = require('fs');
const convert = require('../utils/convert.js');

program.version('0.0.0', '-v --version')
        .arguments('[config_file]')
        .usage('[config_file]')
        .on('--help', () => {
          console.log('\n');
          console.log('config_file  Customize configuration file. Default to protobuf2swagger.config.js under current folder.')
        })
        .parse(process.argv);

const [configPath] = program.args;
const cwd = process.cwd();
const DEFAULT_CONFIG_PATH = 'protobuf2swagger.config.js';
const config = require(path.resolve(cwd, configPath || DEFAULT_CONFIG_PATH));


(async () => {
  const content = await convert(config);
  const dist = config.dist ? path.resolve(cwd, config.dist) : cwd;
  fs.writeFileSync(dist, JSON.stringify(content, null, 2));
  console.info('Converted schema written into ', dist);
})();
