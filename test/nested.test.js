const path = require('path');
const convert = require('../lib/convert');

describe('nested', () => {
  test('can work', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/nested.proto');
    const converted = await convert({
      files: [protopath],
    });
    expect(converted).toMatchSnapshot();
  });
  test('swagger v2', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/nested.proto');
    const converted = await convert({
      files: [protopath],
      customSchema: {
        swagger: '2.0',
      },
    });
    expect(converted).toMatchSnapshot();
  });
});
