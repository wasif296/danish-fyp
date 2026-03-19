const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const { initSocket } = require("./socket");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;

if (!mongoUrl) {
  throw new Error("Missing MongoDB connection string. Set MONGO_URL.");
}

process.on("uncaughtException", (error) => {
  logger.error(error.stack || error.message || "Uncaught exception", {
    stack: error.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logger.error(error.stack || error.message || "Unhandled rejection", {
    stack: error.stack,
  });
});

mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info("Connected to MongoDB");

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      logger.info(`Server started at port no. ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(err.stack || err.message || "Failed to connect to MongoDB", {
      stack: err.stack,
    });
    process.exit(1);
  });
