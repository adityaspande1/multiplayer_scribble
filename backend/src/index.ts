import express from "express";
import http, { createServer } from "http";
import cors from "cors";
import {Server} from "socket.io";
const app = express();

const server= createServer(app);
 const io = new Server(server,{
    cors:{
        origin:"*", // allow all origins
    },
 });

 //middlewares
 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    console.log("Karekram")
    res.json({
        "name": "Aditya Pande",
        "des":"Hello kaisa karekram"
    });
})
server.listen(3000,()=>{
console.log("server is listening on port 3000");
});