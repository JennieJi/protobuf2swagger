const message2JSON = require('./message2JSON');
const enum2JSON = require('./enum2JSON');
const service2JSON = require('./service2Paths');

function processComponents(defs) {
  return Object.keys(defs).reduce((ret, key) => {
    const def = defs[key];
    const strDef = def.toString();
    if (/^Enum /.test(strDef)) {
      return {
        ...ret,
        [key]: enum2JSON(def),
      };
    }
    if (/^Type /.test(strDef)) {
      return {
        ...ret,
        [key]: message2JSON(def),
      };
    }
    return ret;
  }, {});
}

module.exports = processComponents;
