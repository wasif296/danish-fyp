const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

const isProduction = process.env.NODE_ENV === "production";
const logsDirectory = path.resolve(__dirname, "..", "logs");

fs.mkdirSync(logsDirectory, { recursive: true });

const loggerTransports = [];

if (!isProduction) {
  loggerTransports.push(
    new transports.Console({
      level: "http",
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(
          ({ level, message, timestamp }) =>
            `${timestamp} [${level}] ${message}`,
        ),
      ),
    }),
  );
}

loggerTransports.push(
  new transports.File({
    filename: path.join(logsDirectory, "error.log"),
    level: "error",
  }),
);

loggerTransports.push(
  new transports.File({
    filename: path.join(logsDirectory, "combined.log"),
    level: isProduction ? "info" : "http",
  }),
);

if (loggerTransports.length === 0) {
  loggerTransports.push(new transports.Console());
}

const logger = createLogger({
  level: isProduction ? "info" : "http",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: "school-management-backend" },
  transports: loggerTransports,
});

module.exports = logger;
