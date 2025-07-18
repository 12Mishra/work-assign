"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
