const normalizeOrigin = (value) => value?.trim().replace(/\/$/, "");

const getAllowedOrigins = () => {
  const values = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
    .filter(Boolean)
    .flatMap((entry) => entry.split(","))
    .map(normalizeOrigin)
    .filter(Boolean);

  return [...new Set(values)];
};

const isOriginAllowed = (origin, allowedOrigins = getAllowedOrigins()) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  return allowedOrigins.includes(normalizedOrigin);
};

module.exports = {
  getAllowedOrigins,
  isOriginAllowed,
};
