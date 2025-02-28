import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export default function ChatBox({ room }: { room: string }) {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("messageReceived", (msg: string) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => {
      socket.off("messageReceived");
    };
  }, [socket]);

  const sendMessage = () => {
    socket.emit("sendMessage", room, message);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="text"
        placeholder="Guess the word"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2"
      />
      <button onClick={sendMessage} className="bg-green-500 text-white p-2">
        Send
      </button>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
