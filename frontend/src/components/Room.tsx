import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Room({ setRoom }: { setRoom: (room: string) => void }) {
  const [roomId, setRoomId] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("playerUpdated", (updatedUsers: string[]) => setUsers(updatedUsers));

    return () => {
      socket.off("playerUpdated");
    };
  }, []);

  const joinRoom = () => {
    if (!roomId) return;
    socket.emit("join-room", roomId, "Player" + Math.floor(Math.random() * 100));
    setRoom(roomId);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Join a Room</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border p-2"
      />
      <button onClick={joinRoom} className="bg-blue-500 text-white p-2">Join Room</button>
      
      <h3 className="text-lg font-bold mt-4">Players in Room:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index} className="border p-2 my-1">{user}</li>
        ))}
      </ul>
    </div>
  );
}
