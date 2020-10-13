const path = require('path');
const convert = require('../lib/convert');

describe('long', () => {
  test('string by default', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/long.proto');
    const converted = await convert({
      files: [protopath],
    });
    expect(converted).toMatchSnapshot();
  });
  test('use option to change to integer', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/long.proto');
    const converted = await convert({
      files: [protopath],
      long: 'number',
    });
    expect(converted).toMatchSnapshot();
  });
});
