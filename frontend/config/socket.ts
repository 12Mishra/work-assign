// utils/socket.ts
import { io } from "socket.io-client";

const socket = io(`${process.env.NEXT_BACKEND_URL}`); // your backend port

export default socket;