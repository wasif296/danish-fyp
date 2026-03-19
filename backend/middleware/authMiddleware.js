const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || typeof authHeader !== "string") {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Invalid authorization header format" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT configuration is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      ...decoded,
      _id: decoded.id,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};

const isOwnerOrAdmin = (paramName = "id") => {
  return (req, res, next) => {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role === "Admin") {
      return next();
    }

    if (String(req.user._id) !== String(req.params[paramName])) {
      return res.status(403).json({ message: "Access denied" });
    }

    return next();
  };
};

module.exports = { authMiddleware, checkRole, isOwnerOrAdmin };
