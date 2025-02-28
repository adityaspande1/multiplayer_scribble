"use client"

import { useState } from "react"
import RoomJoin from "./components/roomJoin"
import Canvas from "./components/canvas"
import ChatBox from "./components/chatBox"
import PlayerList from "./components/playerList"
import { SocketContext } from "./context/SocketContext"
import { io } from "socket.io-client"
import { Pencil, Users, MessageCircle } from "lucide-react"

export default function App() {
  const [room, setRoom] = useState("")
  const [username, setUsername] = useState("")
  const [isJoined, setIsJoined] = useState(false)

  const handleJoinRoom = (roomId: string, name: string) => {
    setRoom(roomId)
    setUsername(name)
    setIsJoined(true)
  }

  return (
    <SocketContext.Provider value={io("http://localhost:3000")}>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Scribble<span className="text-indigo-500">.io</span>
            </h1>
            <p className="text-gray-600 mt-2">Draw, Guess, Win!</p>
          </header>

          {!isJoined ? (
            <div className="max-w-md mx-auto">
              <RoomJoin onJoinRoom={handleJoinRoom} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Pencil className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Drawing Board</h2>
                  </div>
                  <Canvas room={room} />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-xl font-semibold text-gray-800">Chat & Guesses</h2>
                  </div>
                  <ChatBox room={room} username={username} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 border border-indigo-100 h-fit">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Players</h2>
                </div>
                <PlayerList />
              </div>
            </div>
          )}
        </div>
      </div>
    </SocketContext.Provider>
  )
}

