const path = require('path');
const convert = require('../lib/convert');

describe('enum', () => {
  test('can work', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/enum.proto');
    const converted = await convert({
      files: [protopath],
    });
    expect(converted).toMatchSnapshot();
  });
  test('swagger v2', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/enum.proto');
    const converted = await convert({
      files: [protopath],
      customSchema: {
        swagger: '2.0',
      },
    });
    expect(converted).toMatchSnapshot();
  });
  test('transform hook', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/enum.proto');
    const converted = await convert({
      files: [protopath],
      transform(type, result, args) {
        if (type === 'enum') {
          return {
            type: 'enum',
            enum: ['test'],
          };
        }
        return result;
      },
    });
    expect(converted).toMatchInlineSnapshot(`
      Object {
        "components": Object {
          "schemas": Object {
            "examplepb.NumericEnum": Object {
              "enum": Array [
                "test",
              ],
              "type": "enum",
            },
          },
        },
        "info": Object {
          "description": "",
          "title": "enum",
          "version": "1",
        },
        "openapi": "3.0.0",
        "paths": Object {},
      }
    `);
  });
});
