// utils/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // your backend port

export default socket;