import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

interface User{
    id: number,
    username: string,
    socketId: string,   
    room_id:string,
    score:number,
}
export default function PlayerList() {
  const socket = useSocket();
  const [users, setUsers] = useState<User[]>([]);
  const [currentWord, setCurrentWord] = useState("?");
  const [currentDrawer, setCurrentDrawer] = useState("");

  useEffect(() => {
    socket.on("playerUpdated", (updatedUsers) => setUsers(updatedUsers));
    socket.on("updateWord", (word) => setCurrentWord(word));
    socket.on("updateDrawer", (drawer) => setCurrentDrawer(drawer));

    return () => {
      socket.off("playerUpdated");
      socket.off("updateWord");
      socket.off("updateDrawer");
    };
  }, [socket]);

  return (
    <div>
      <p>Current Word: {currentWord}</p>
      <p>Current Drawer: {currentDrawer}</p>
      <h3>Players:</h3>
      {users.map((User, index) => (
        <p key={index}>{User.username} - {User.score} points</p>
      ))}
    </div>
  );
}
