const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const { getAllowedOrigins, isOriginAllowed } = require("./utils/origins");
const logger = require("./utils/logger");

dotenv.config();

const app = express();
const Routes = require("./routes/route.js");

const allowedOrigins = getAllowedOrigins();
const frontendBuildDir = path.resolve(__dirname, "..", "frontend", "build");
const frontendDistDir = path.resolve(__dirname, "..", "frontend", "dist");
const frontendStaticDir = fs.existsSync(frontendBuildDir)
  ? frontendBuildDir
  : frontendDistDir;

const requestLogFormat =
  process.env.NODE_ENV === "production" ? "combined" : "dev";

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(
  morgan(requestLogFormat, {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      if (
        allowedOrigins.length === 0 ||
        isOriginAllowed(origin, allowedOrigins)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/", Routes);

if (process.env.NODE_ENV === "production" && fs.existsSync(frontendStaticDir)) {
  app.use(express.static(frontendStaticDir));

  app.get("*", (_req, res) => {
    return res.sendFile(path.join(frontendStaticDir, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (status >= 500) {
    logger.error("Unhandled application error", {
      status,
      message: err.message,
      stack: err.stack,
    });
  }

  const message =
    status >= 500 && isProduction
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(status).json({
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

module.exports = app;
