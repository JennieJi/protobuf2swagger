const path = require('path');
const convert = require('../lib/convert');

describe('service', () => {
  test('can work', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/service.proto');
    const converted = await convert({
      files: [protopath],
      transform(type, result) {
        if (type === 'service') {
          return {
            ...result,
            '/test': {},
          };
        }
        return result;
      },
    });
    expect(converted).toMatchSnapshot();
  });
  test('swagger v2', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/service.proto');
    const converted = await convert({
      files: [protopath],
      customSchema: {
        swagger: '2.0',
      },
    });
    expect(converted).toMatchSnapshot();
  });
});
