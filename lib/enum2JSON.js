function enum2JSON(proto) {
  const { values, comments, comment } = proto;
  return {
    type: 'number',
    enum: Object.values(values),
    description:
        comment +'\n' +
        Object.keys(values).map(
        (key) =>
          `${values[key]} - ${key} ${
            comments[key] ? `// ${comments[key]}` : ''
          }`
      )
      .join('\n'),
  };
}

module.exports = enum2JSON;
