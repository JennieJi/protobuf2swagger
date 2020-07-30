const path = require('path');
const convert = require('../lib/convert');

describe('a bit of everything', () => {
  test('can work', async () => {
    const protopath = path.resolve(
      __dirname,
      '__fixtures__/a_bit_of_everything.proto'
    );
    const converted = await convert({
      files: [protopath],
    });
    expect(converted).toMatchSnapshot();
  });
});
