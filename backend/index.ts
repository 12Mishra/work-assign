import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client ", socket.id);

  socket.on("feeStatusUpdated", () => {
    console.log("Fee payment update received.");
    socket.broadcast.emit("refreshStudents");
  });

  socket.on("newUserAdded", () => {
    console.log("New user event added.");
    socket.broadcast.emit("refreshNewStudents");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
