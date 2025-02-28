import { useState } from "react";
import { useSocket } from "../context/SocketContext";

export default function RoomJoin() {
  const socket = useSocket();
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    socket.emit("join-room", room, "Player" + Math.floor(Math.random() * 100));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Room ID"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="border p-2"
      />
      <button onClick={joinRoom} className="bg-blue-500 text-white p-2">Join Room</button>
    </div>
  );
}
