const validateRequest = (schema, property = "body") => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationError = new Error(
        error.details.map((detail) => detail.message).join(", "),
      );
      validationError.status = 400;
      return next(validationError);
    }

    req[property] = value;
    return next();
  };
};

module.exports = { validateRequest };
