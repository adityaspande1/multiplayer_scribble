import supabase from "../db/db";
import { Room, User } from "../models/rooms";

// Create a new room
export const createRoom = async (roomName: string): Promise<Room | null> => {
    try {
        const { data, error } = await supabase
            .from("rooms")
            .insert([{ name: roomName }])
            .select()
            .single();

            console.log("New room created:", data);

        if (error) throw error;

        return { id: data.id, name: data.name, createdAt: data.createdAt, users: [] };
    } catch (error) {
        console.error("Error creating room:", error);
        return null;
    }
};

// Get all rooms with users
export const getRooms = async (): Promise<Room[]> => {
    try {
        const { data, error } = await supabase
            .from("rooms")
            .select("*, users(*)");

        if (error) throw error;

        return data.map((row: any) => ({
            id: row.id,
            name: row.name,
            createdAt: row.createdAt,
            users: row.users || []
        }));
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
};

// Add user to a room
export const addUserToRoom = async (username: string, socketId: string, roomId: any): Promise<User | null> => {
    try {
        const parsedRoomId = parseInt(roomId, 10);
        if (isNaN(parsedRoomId)) {
            console.error("Invalid room ID:", roomId);
            return null;
        }

        // Check if room exists
        const { data: room, error: roomError } = await supabase
            .from("rooms")
            .select("*")
            .eq("id", parsedRoomId)
            .single();

        if (roomError || !room) {
            console.error(`Room with ID ${parsedRoomId} does not exist.`);
            return null;
        }

        const { data, error } = await supabase
            .from("users")
            .insert([{ username, socket_id: socketId, room_id: parsedRoomId }])
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            username: data.username,
            socketId: data.socket_id,
            room_id: data.room_id,
            score: data.score
        };
    } catch (error) {
        console.error("Error adding user to room:", error);
        return null;
    }
};

// Get all users in a room
export const getUsersInRoom = async (roomId: any): Promise<User[]> => {
    try {
        const parsedRoomId = parseInt(roomId, 10);
        if (isNaN(parsedRoomId)) {
            console.error("Invalid room ID:", roomId);
            return [];
        }

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("room_id", parsedRoomId);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

// Remove user from a room
export const removeUser = async (socketId: string): Promise<void> => {
    try {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("socket_id", socketId);

        if (error) throw error;
    } catch (error) {
        console.error("Error removing user:", error);
    }
};

// Update user score
export const updateUserScore = async (userId: number, points: number): Promise<void> => {
    try {
        const { error } = await supabase
            .from("users")
            .update({ score: supabase.rpc("increment", { x: points }) })
            .eq("id", userId);

        if (error) throw error;
    } catch (error) {
        console.error("Error updating score:", error);
    }
};
