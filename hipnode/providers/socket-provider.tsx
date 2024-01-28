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
  activeUsers: string[];
};

const SocketContext = createContext<ContextType>({
  io: null,
  isConnected: false,
  activeUsers: [],
});

export const SocketProvider: FC<ContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        await fetch("/api/socket");
        const URL =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_SITE_URL
            : "http://localhost:3000";

        const socketConnection = io(URL!, {
          addTrailingSlash: false,
        });

        socket?.connect();
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
    socket.on("set-active-users", (users: string[]) => {
      setActiveUsers(users);
    });
    socket.on("connect_error", (error) => {
      console.log(`Connect error due to ${error}`);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  }, [socket]);

  console.log(isConnected);

  return (
    <SocketContext.Provider value={{ io: socket, isConnected, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
