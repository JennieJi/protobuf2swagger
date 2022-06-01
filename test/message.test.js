const path = require('path');
const convert = require('../lib/convert');

describe('message', () => {
  test('can work', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/message.proto');
    const converted = await convert({
      files: [protopath],
    });
    expect(converted).toMatchSnapshot();
  });
  test('swagger v2', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/message.proto');
    const converted = await convert({
      files: [protopath],
      customSchema: {
        swagger: '2.0',
      },
    });
    expect(converted).toMatchSnapshot();
  });
  test('transform hook', async () => {
    const protopath = path.resolve(__dirname, '__fixtures__/message.proto');
    const converted = await convert({
      files: [protopath],
      transform(type, result, args) {
        if (type === 'message') {
          return {
            ...result,
            description: 'message overwritten',
          };
        }
        if (type === 'field') {
          return {
            ...result,
            description: 'field overwritten',
          };
        }
        return result;
      },
    });
    expect(converted).toMatchInlineSnapshot(`
      Object {
        "components": Object {
          "schemas": Object {
            "message.Book": Object {
              "description": "message overwritten",
              "properties": Object {
                "id": Object {
                  "description": "Output only. The book's ID.",
                  "type": "string",
                },
                "name": Object {
                  "description": "The resource name of the book.

      Format: \`publishers/{publisher}/books/{book}\`

      Example: \`publishers/1257894000000000000/books/my-book\`",
                  "type": "string",
                },
                "stock": Object {
                  "format": "int32",
                  "type": "integer",
                },
              },
              "required": Array [
                "id",
              ],
              "type": "object",
            },
          },
        },
        "info": Object {
          "description": "",
          "title": "message",
          "version": "1",
        },
        "openapi": "3.0.0",
        "paths": Object {},
      }
    `);
  });
});
