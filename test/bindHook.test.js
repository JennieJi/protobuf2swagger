const path = require('path');
const bindHook = require('../lib/bindHook');

describe('bindHook', () => {
  test('can work', async () => {
    const testFn = bindHook(process.cwd(), 'lib/bakeRef', 'test', (...args) => args);
    expect(testFn({}, 'a')).toMatchInlineSnapshot(`
      Array [
        "test",
        Object {},
        Array [
          Object {},
          "a",
        ],
      ]
    `);
  });
});
