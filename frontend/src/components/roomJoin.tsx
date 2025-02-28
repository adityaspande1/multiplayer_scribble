"use client"

import { useState } from "react";
import { useSocket } from "../context/SocketContext";

interface RoomJoinProps {
  onJoinRoom: (roomId: string, username: string) => void;
}

export default function RoomJoin({ onJoinRoom }: RoomJoinProps) {
  const socket = useSocket();
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const joinRoom = () => {
    if (!room.trim()) {
      setError("Please enter a room ID");
      return;
    }
    
    if (!username.trim()) {
      setUsername("Player" + Math.floor(Math.random() * 1000));
    }
    
    const finalUsername = username.trim() || "Player" + Math.floor(Math.random() * 1000);
    
    socket.emit("join-room", room, finalUsername);
    onJoinRoom(room, finalUsername);
  };

  const handleCreateRoom = () => {
    const randomRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoom(randomRoomId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Join a Game</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Your Nickname
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your nickname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
            Room ID
          </label>
          <div className="flex gap-2">
            <input
              id="roomId"
              type="text"
              placeholder="Enter Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <button 
              onClick={handleCreateRoom}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              title="Generate random room ID"
            >
              Random
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        
        <div className="pt-2">
          <button 
            onClick={joinRoom} 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}
