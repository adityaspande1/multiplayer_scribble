"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSocket } from "../context/SocketContext"
import { Send } from "lucide-react"

interface Message {
  text: string
  sender: string
  isSystem?: boolean
  isCorrect?: boolean
}

export default function ChatBox({ room, username }: { room: string; username: string }) {
  const socket = useSocket()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socket.on("messageReceived", (msg: string, sender: string, isCorrect = false) => {
      setMessages((prev) => [...prev, { text: msg, sender, isCorrect }])
    })

    socket.on("systemMessage", (msg: string) => {
      setMessages((prev) => [...prev, { text: msg, sender: "System", isSystem: true }])
    })

    return () => {
      socket.off("messageReceived")
      socket.off("systemMessage")
    }
  }, [socket])

  useEffect(() => {
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (message.trim()) {
      socket.emit("sendMessage", room, message, username)
      setMessage("")
    }
  }

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 rounded-lg mb-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 italic">
            No messages yet. Start guessing!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-lg max-w-[85%] ${
                msg.isSystem
                  ? "bg-indigo-100 text-indigo-800 mx-auto text-center"
                  : msg.sender === username
                    ? "bg-indigo-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
              } ${msg.isCorrect ? "bg-green-500 text-white" : ""}`}
            >
              {!msg.isSystem && (
                <div className="text-xs opacity-75 mb-1">{msg.sender === username ? "You" : msg.sender}</div>
              )}
              <div>{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Guess the word..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-1"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  )
}

