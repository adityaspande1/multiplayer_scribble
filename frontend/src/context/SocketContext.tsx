import { createContext, useContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Prevents auto connection before user login
});

export const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketInstance = useMemo(() => socket, []);

  useEffect(() => {
    socketInstance.connect(); // Connect when provider mounts

    return () => {
      socketInstance.disconnect(); // Disconnect when provider unmounts
    };
  }, [socketInstance]);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};
