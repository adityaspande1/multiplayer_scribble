import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";

export default function Canvas({ room }: { room: string }) {
  const socket = useSocket();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext("2d");
    }

    socket.on("onDraw", ({ x, y, type }) => draw(x, y, type));

    return () => {
      socket.off("onDraw");
    };
  }, [socket]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e.clientX, e.clientY, "start");
  };

  const draw = (x: number, y: number, type: string) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.stroke();
    socket.emit("draw", room, { x, y, type });
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      className="border w-[500px] h-[400px]"
    />
  );
}
