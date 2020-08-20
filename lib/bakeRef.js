function bakeRef(root, name) {
  try {
    const type = root.lookup(name);
    if (type) {
      return {
        $ref: `#/definitions/${type.fullName.slice(1)}`,
      };
    }
  } catch (e) {}
  return {};
}

module.exports = bakeRef;
