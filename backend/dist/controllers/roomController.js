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
exports.updateUserScore = exports.removeUser = exports.getUsersInRoom = exports.addUserToRoom = exports.getRooms = exports.createRoom = void 0;
const db_1 = require("../db/db");
// Create a new room
const createRoom = (roomName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query("INSERT INTO rooms (name) VALUES ($1) RETURNING *", [roomName]);
        return Object.assign(Object.assign({}, result.rows[0]), { users: [] });
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
        const result = yield db_1.pool.query(`SELECT r.*, 
            COALESCE(json_agg(u.*) FILTER (WHERE u.id IS NOT NULL), '[]') AS users
            FROM rooms r
            LEFT JOIN users u ON r.id = u.room_id
            GROUP BY r.id`);
        return result.rows;
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
        const result = yield db_1.pool.query("INSERT INTO users (username, socket_id, room_id) VALUES ($1, $2, $3) RETURNING *", [username, socketId, roomId]);
        return result.rows[0];
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
        const result = yield db_1.pool.query("SELECT * FROM users WHERE room_id = $1", [roomId]);
        return result.rows;
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
        yield db_1.pool.query("DELETE FROM users WHERE socket_id = $1", [socketId]);
    }
    catch (error) {
        console.error("Error removing user:", error);
    }
});
exports.removeUser = removeUser;
//to update score of user
const updateUserScore = (userId, points) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.pool.query("UPDATE users SET score = score + $1 WHERE id = $2", [points, userId]);
    }
    catch (error) {
        console.error("Error updating score:", error);
    }
});
exports.updateUserScore = updateUserScore;
