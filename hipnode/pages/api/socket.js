import { getAuth } from "@clerk/nextjs/server";
import { Server } from "socket.io";

export default function handler(req, res) {
  const userMap = new Map()

  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {

    console.log("Socket is initializing");
    const io = new Server(res.socket.server, { addTrailingSlash: false });
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log("user connected");

      const { userId } = getAuth(req)

      // Active Users
      userMap.set(userId, [...userMap.keys()]);

      // Emit initial active users list
      socket.emit("set-active-users", [...userMap.keys()]);

      socket.on("disconnect", () => {
        console.log('disconnected');
        userMap.delete(userId)
      });
    });
  }
  res.end();
}
