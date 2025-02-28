"use client"

import { useEffect, useState } from "react"
import { useSocket } from "../context/SocketContext"
import { Crown, Pencil } from "lucide-react"

interface User {
  id: number
  username: string
  socketId: string
  room_id: string
  score: number
}

export default function PlayerList() {
  const socket = useSocket()
  const [users, setUsers] = useState<User[]>([])
  const [currentWord, setCurrentWord] = useState("?")
  const [currentDrawer, setCurrentDrawer] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [roundNumber, setRoundNumber] = useState(1)

  useEffect(() => {
    socket.on("playerUpdated", (updatedUsers: User[]) => {
      // Sort users by score in descending order
      const sortedUsers = [...updatedUsers].sort((a, b) => b.score - a.score)
      setUsers(sortedUsers)
    })

    socket.on("updateWord", (word: string) => setCurrentWord(word))
    socket.on("updateDrawer", (drawer: string) => setCurrentDrawer(drawer))
    socket.on("updateTime", (time: number) => setTimeLeft(time))
    socket.on("updateRound", (round: number) => setRoundNumber(round))

    return () => {
      socket.off("playerUpdated")
      socket.off("updateWord")
      socket.off("updateDrawer")
      socket.off("updateTime")
      socket.off("updateRound")
    }
  }, [socket])

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-indigo-800">Round</h3>
            <p className="text-2xl font-bold text-indigo-900">{roundNumber}/3</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-indigo-800">Time Left</h3>
            <p className="text-2xl font-bold text-indigo-900">{timeLeft}s</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-indigo-800">Current Word</h3>
          <div className="flex gap-1 mt-1">
            {currentWord === "?" ? (
              <div className="text-xl font-bold text-indigo-900">?????</div>
            ) : (
              currentWord.split("").map((char, index) => (
                <div
                  key={index}
                  className="w-8 h-8 flex items-center justify-center border-b-2 border-indigo-400 font-bold text-indigo-900"
                >
                  {char}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-indigo-800">Current Drawer</h3>
          <div className="flex items-center gap-2 mt-1">
            <Pencil className="w-4 h-4 text-indigo-500" />
            <p className="font-medium text-indigo-900">{currentDrawer || "Waiting..."}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Players</h3>
        <div className="space-y-2">
          {users.length === 0 ? (
            <div className="text-gray-500 italic">No players yet</div>
          ) : (
            users.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                  <span className={`font-medium ${index === 0 ? "text-yellow-700" : "text-gray-800"}`}>
                    {user.username}
                  </span>
                  {user.username === currentDrawer && <Pencil className="w-4 h-4 text-indigo-500" />}
                </div>
                <div className="bg-white px-2 py-1 rounded font-bold text-indigo-600 border border-indigo-100">
                  {user.score}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

