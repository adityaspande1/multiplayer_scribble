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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserScore = exports.removeUser = exports.getUsersInRoom = exports.addUserToRoom = exports.getRooms = exports.createRoom = void 0;
const db_1 = __importDefault(require("../db/db"));
// Create a new room
const createRoom = (roomName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield db_1.default
            .from("rooms")
            .insert([{ name: roomName }])
            .select()
            .single();
        console.log("New room created:", data);
        if (error)
            throw error;
        return { id: data.id, name: data.name, createdAt: data.createdAt, users: [] };
    }
    catch (error) {
        console.error("Error creating room:", error);
        return null;
    }
});
exports.createRoom = createRoom;
// Get all rooms with users
const getRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield db_1.default
            .from("rooms")
            .select("*, users(*)");
        if (error)
            throw error;
        return data.map((row) => ({
            id: row.id,
            name: row.name,
            createdAt: row.createdAt,
            users: row.users || []
        }));
    }
    catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
});
exports.getRooms = getRooms;
// Add user to a room
const addUserToRoom = (username, socketId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedRoomId = parseInt(roomId, 10);
        if (isNaN(parsedRoomId)) {
            console.error("Invalid room ID:", roomId);
            return null;
        }
        // Check if room exists
        const { data: room, error: roomError } = yield db_1.default
            .from("rooms")
            .select("*")
            .eq("id", parsedRoomId)
            .single();
        if (roomError || !room) {
            console.error(`Room with ID ${parsedRoomId} does not exist.`);
            return null;
        }
        const { data, error } = yield db_1.default
            .from("users")
            .insert([{ username, socket_id: socketId, room_id: parsedRoomId }])
            .select()
            .single();
        if (error)
            throw error;
        return {
            id: data.id,
            username: data.username,
            socketId: data.socket_id,
            room_id: data.room_id,
            score: data.score
        };
    }
    catch (error) {
        console.error("Error adding user to room:", error);
        return null;
    }
});
exports.addUserToRoom = addUserToRoom;
// Get all users in a room
const getUsersInRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedRoomId = parseInt(roomId, 10);
        if (isNaN(parsedRoomId)) {
            console.error("Invalid room ID:", roomId);
            return [];
        }
        const { data, error } = yield db_1.default
            .from("users")
            .select("*")
            .eq("room_id", parsedRoomId);
        if (error)
            throw error;
        return data;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
});
exports.getUsersInRoom = getUsersInRoom;
// Remove user from a room
const removeUser = (socketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = yield db_1.default
            .from("users")
            .delete()
            .eq("socket_id", socketId);
        if (error)
            throw error;
    }
    catch (error) {
        console.error("Error removing user:", error);
    }
});
exports.removeUser = removeUser;
// Update user score
const updateUserScore = (userId, points) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = yield db_1.default
            .from("users")
            .update({ score: db_1.default.rpc("increment", { x: points }) })
            .eq("id", userId);
        if (error)
            throw error;
    }
    catch (error) {
        console.error("Error updating score:", error);
    }
});
exports.updateUserScore = updateUserScore;
