import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import cors from "cors";

import messageRoutes from "./routes/message.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://sahayak0.vercel.app/"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://sahayak0.vercel.app/"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use("/api/send-message", messageRoutes);

const users = {};

io.on("connection", async (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  const userId = socket.handshake.auth.userId;

  if (userId) {
    users[userId] = socket.id;
  }
  console.log(users);
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

export const getReceiverSocketId = (receiverId) => {
  console.log(receiverId, "receiver id");
  return users[receiverId];
};

export { io };

server.listen(3001, () => {
  console.log(`Server is running on PORT 3001`);
});
