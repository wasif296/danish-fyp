import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (eventName, handler) => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!eventName || typeof handlerRef.current !== "function") {
      return undefined;
    }

    const socket = io(
      process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BASE_URL || "",
      {
        transports: ["websocket", "polling"],
      },
    );

    const eventHandler = (...args) => {
      if (typeof handlerRef.current === "function") {
        handlerRef.current(...args);
      }
    };

    socket.on(eventName, eventHandler);

    return () => {
      socket.off(eventName, eventHandler);
      socket.disconnect();
    };
  }, [eventName]);
};

export default useSocket;
