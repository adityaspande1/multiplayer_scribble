import { Server, Socket } from "socket.io";
import { createRoom, addUserToRoom, removeUser, getUsersInRoom, updateUserScore } from "./controllers/roomController";
import { selectRandomWord } from "./utils/wordSelector";

const activeGames: { [roomId: number]: { word: string; drawingUser: number } } = {};

const selectedWord: { [key: number]: string } = {}; // Track words per room

export const setupSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("New Client Connected:", socket.id);
        
        socket.on("create-room", async (roomName: string) => {
           const newRoom = await createRoom(roomName);
           if (!newRoom) {
               console.log("Failed to create room");
               return;
           }
           console.log("New room created:", newRoom);
        });

        socket.on("join-room", async (roomId: number, username: string) => {
            const user = await addUserToRoom(username, socket.id, roomId);
            if (!user) return;

            socket.join(roomId.toString());
            const updatedUsers = await getUsersInRoom(roomId);
            io.to(roomId.toString()).emit("playerUpdated", updatedUsers);
        });

        socket.on("start-game", async (roomId: number) => {
            const users = await getUsersInRoom(roomId);
            if (users.length < 2) {
                socket.emit("error", "Not enough players to start the game.");
                return;
            }
            
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const word = selectRandomWord();
            activeGames[roomId] = { word, drawingUser: randomUser.id };

            io.to(roomId.toString()).emit("gameStarted", { word, drawingUser: randomUser });
        });

        socket.on("draw", (roomId: number, data) => {
            console.log("Drawing data received:", data);
            socket.to(roomId.toString()).emit("onDraw", data);
        });


        socket.on("sendMessage", async (roomId: number, message: string, userId: number) => {
            if (!activeGames[roomId]) return;
            
            if (message.toLowerCase() === activeGames[roomId].word.toLowerCase()) {
                await updateUserScore(userId, 100);
                const users = await getUsersInRoom(roomId);
                const nextDrawer = users.find(u => u.id !== activeGames[roomId].drawingUser);
                activeGames[roomId] = { word: selectRandomWord(), drawingUser: nextDrawer!.id };
                
                io.to(roomId.toString()).emit("correctGuess", { userId, newWord: activeGames[roomId].word, newDrawer: nextDrawer });
            } else {
                socket.to(roomId.toString()).emit("messageReceived", { message, userId });
            }
        });

        socket.on("disconnect", async () => {
            console.log("Client Disconnected:", socket.id);
            await removeUser(socket.id);
        });
    });
};

const switchTurn = async (io: Server, roomId: number) => {
    const users = await getUsersInRoom(roomId);
    if (users.length === 0) return;

    const nextDrawer = users[Math.floor(Math.random() * users.length)];
    selectedWord[roomId] = selectRandomWord(); 

    io.to(roomId.toString()).emit("newRound", { drawer: nextDrawer.id, word: selectedWord[roomId] });
};
