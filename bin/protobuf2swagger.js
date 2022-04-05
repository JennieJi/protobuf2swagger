#!/usr/bin/env node
'use strict';

const core = require('@actions/core');
const github = require('@actions/github');

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


const config = {
  files: [core.getInput('protobuf')]
}


(async () => {
  const content = await convert(config);
  const openapi = JSON.stringify(content, null, 2)
  core.setOutput("openapi", openapi);
  console.info('Converted schema written into ', dist);
})();
