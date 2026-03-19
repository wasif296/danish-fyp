const { Server } = require("socket.io");
const { getAllowedOrigins, isOriginAllowed } = require("./utils/origins");

let ioInstance;

const initSocket = (server) => {
  const allowedOrigins = getAllowedOrigins();

  ioInstance = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (
          allowedOrigins.length === 0 ||
          isOriginAllowed(origin, allowedOrigins)
        ) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by Socket.IO CORS"));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    socket.on("disconnect", () => {});
  });

  return ioInstance;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized.");
  }

  return ioInstance;
};

module.exports = {
  initSocket,
  getIO,
};
