const assert = require('assert');
const path = require('path');

function bindHook(cwd, modulePath, type, hook) {
  modulePath = require.resolve(modulePath, { paths: [cwd] });
  const originalModule = require(modulePath);
  if (!hook) return originalModule;
  assert(typeof originalModule === 'function');
  return (require.cache[modulePath].exports = (...args) => {
    const result = originalModule(...args);
    return hook(type, result, args);
  });
}
module.exports = bindHook;
