const message2JSON = require('./message2JSON');
const enum2JSON = require('./enum2JSON');

function processComponents(defs) {
  return Object.values(defs).reduce((ret, def) => {
    const strDef = def.toString();
    const { name } = def;
    if (/^Enum /.test(strDef)) {
      return {
        ...ret,
        [name]: enum2JSON(def)
      };
    }
    if (/^Type /.test(strDef)) {
      return {
        ...ret,
        [name]: message2JSON(def)
      };
    }
    return ret;
  }, {})
}

module.exports = processComponents;