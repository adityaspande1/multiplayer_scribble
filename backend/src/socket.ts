import { Server, Socket } from "socket.io";
import { createRoom,addUserToRoom, removeUser, getUsersInRoom } from "./controllers/roomController";

export const setupSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("New Client Connected:", socket.id);
        socket.on("create-room", async (roomName: string) => {
           const newRoom= await createRoom(roomName);
              if(!newRoom){
                console.log("Failed to create room");
                return;
              }

              console.log("New room created : ",newRoom);
        });


        socket.on("join-room", async (roomId: number, username: string) => {
            const user = await addUserToRoom(username, socket.id, roomId);
            if (!user) return;

            socket.join(roomId.toString());

            const updatedUsers = await getUsersInRoom(roomId);
            io.to(roomId.toString()).emit("playerUpdated", updatedUsers);
        });

        socket.on("draw", (roomId: number, data) => {
            console.log("Drawing data received:", data);
            socket.to(roomId.toString()).emit("onDraw", data);
        });

        socket.on("sendMessage", (roomId: number, message: string) => {
            console.log("Message received:", message);
            socket.to(roomId.toString()).emit("messageReceived", message);
        });

        socket.on("disconnect", async () => {
            console.log("Client Disconnected:", socket.id);
            await removeUser(socket.id);
        });
    });
};
