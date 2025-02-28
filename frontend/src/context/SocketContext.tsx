import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export const SocketContext = createContext(socket);
export const useSocket = () => useContext(SocketContext);
