import {pool} from "../db/db";
import { Room, User } from "../models/rooms";

// Create a new room
export const createRoom = async (roomName: string): Promise<Room | null> => {
    try {
        const result = await pool.query(
            "INSERT INTO rooms (name) VALUES ($1) RETURNING *",
            [roomName]
        );
        return { ...result.rows[0], users: [] };
    } catch (error) {
        console.error("Error creating room:", error);
        return null;
    }
};

// Get all rooms with users
export const getRooms = async (): Promise<Room[]> => {
    try {
        const result = await pool.query(
            `SELECT r.*, 
            COALESCE(json_agg(u.*) FILTER (WHERE u.id IS NOT NULL), '[]') AS users
            FROM rooms r
            LEFT JOIN users u ON r.id = u.room_id
            GROUP BY r.id`
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
};

// Add user to a room
export const addUserToRoom = async (username: string, socketId: string, roomId: number): Promise<User | null> => {
    try {
        const result = await pool.query(
            "INSERT INTO users (username, socket_id, room_id) VALUES ($1, $2, $3) RETURNING *",
            [username, socketId, roomId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error adding user to room:", error);
        return null;
    }
};

// Get all users in a room
export const getUsersInRoom = async (roomId: number): Promise<User[]> => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE room_id = $1", [roomId]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

// Remove user from a room
export const removeUser = async (socketId: string): Promise<void> => {
    try {
        await pool.query("DELETE FROM users WHERE socket_id = $1", [socketId]);
    } catch (error) {
        console.error("Error removing user:", error);
    }
};
