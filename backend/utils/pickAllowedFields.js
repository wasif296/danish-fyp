const pickAllowedFields = (source = {}, allowedFields = []) => {
  return allowedFields.reduce((accumulator, field) => {
    if (source[field] !== undefined) {
      accumulator[field] = source[field];
    }

    return accumulator;
  }, {});
};

module.exports = { pickAllowedFields };
