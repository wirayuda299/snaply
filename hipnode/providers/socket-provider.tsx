"use client";

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type ContextProviderProps = {
  children: ReactNode;
};

type ContextType = {
  io: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<ContextType>({
  io: null,
  isConnected: false,
});

export const SocketProvider: FC<ContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        await fetch("/api/socket");
        const socketConnection = io({
          addTrailingSlash: false,
        });
        setSocket(socketConnection);
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };
    connectSocket();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, [socket]);

  return (
    <SocketContext.Provider value={{ io: socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
