const jwt = require("jsonwebtoken");

const signAuthToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id?.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const createAuthResponse = (userDocument) => {
  const user = userDocument.toObject
    ? userDocument.toObject()
    : { ...userDocument };
  delete user.password;

  return {
    ...user,
    token: signAuthToken(user),
  };
};

module.exports = { signAuthToken, createAuthResponse };
