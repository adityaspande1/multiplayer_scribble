"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const roomController_1 = require("./controllers/roomController");
const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New Client Connected:", socket.id);
        socket.on("create-room", (roomName) => __awaiter(void 0, void 0, void 0, function* () {
            const newRoom = yield (0, roomController_1.createRoom)(roomName);
            if (!newRoom) {
                console.log("Failed to create room");
                return;
            }
            console.log("New room created : ", newRoom);
        }));
        socket.on("join-room", (roomId, username) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, roomController_1.addUserToRoom)(username, socket.id, roomId);
            if (!user)
                return;
            socket.join(roomId.toString());
            const updatedUsers = yield (0, roomController_1.getUsersInRoom)(roomId);
            io.to(roomId.toString()).emit("playerUpdated", updatedUsers);
        }));
        socket.on("draw", (roomId, data) => {
            console.log("Drawing data received:", data);
            socket.to(roomId.toString()).emit("onDraw", data);
        });
        socket.on("sendMessage", (roomId, message) => {
            console.log("Message received:", message);
            socket.to(roomId.toString()).emit("messageReceived", message);
        });
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Client Disconnected:", socket.id);
            yield (0, roomController_1.removeUser)(socket.id);
        }));
    });
};
exports.setupSocket = setupSocket;
