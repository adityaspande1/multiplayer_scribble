import { Server, Socket } from "socket.io";

export const setupSocket = (io: Server) => {
    const rooms: { [key: string]: any } = {};

    io.on("connection", (socket: Socket) => {
        console.log("New Client Connected :", socket.id);

        socket.on("join-room",(roomId:string,username:string)=>{
            if(!rooms[roomId]){
                rooms[roomId] = [];
            }
            //adding user to the room.
            rooms[roomId].push({id:socket.id,username});
            //we will send the updated player list to all the players in the room.
            io.to(roomId).emit("playerUpdated",rooms[roomId]); 
        });

        socket.on("draw",(roomId:string, data)=>{
            console.log("Drawing data received from client",data);
            socket.to(roomId).emit("onDraw", data);
        });

        socket.on("sendMessage",(roomId:string, messsage:string)=>{
            console.log("Message received from client",messsage);
            socket.to(roomId).emit("messageRecieved",messsage);
        });

        socket.on("disconnect",()=>{
            console.log("Client Disconnected : ",socket.id);
            for(const roomId in rooms){
                rooms[roomId]=rooms[roomId].filter((p:Socket)=>p.id !== socket.id);
                io.to(roomId).emit("playerUpdated",rooms[roomId]); 
            }
        })
    });

};
