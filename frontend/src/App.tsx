import RoomJoin from "./components/roomJoin";
import Canvas from "./components/canvas";
import ChatBox from "./components/chatBox";
import PlayerList from "./components/playerList";
import { SocketContext } from "./context/SocketContext";
import { io } from "socket.io-client";


export default function App() {

  return (
    <SocketContext.Provider value={io("http://localhost:3000")}>
      <div className="p-4 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Scribble Clone</h1>
        <RoomJoin />
        <Canvas room="defaultRoom" />
        <PlayerList />
        <ChatBox room="defaultRoom" />
       
      </div>
    </SocketContext.Provider>
  );
}
