import { io } from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
  withCredentials: true,
  transports: ["websocket"],
  secure: true,
  reconnection: true,
});

export default socket;
