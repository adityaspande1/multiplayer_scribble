"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useSocket } from "../context/SocketContext"

const COLORS = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#A52A2A", // Brown
  "#808080", // Gray
]

const BRUSH_SIZES = [2, 5, 10, 15, 20]

export default function Canvas({ room }: { room: string }) {
  const socket = useSocket()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const [canClear, setCanClear] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.strokeStyle = color
        ctx.lineWidth = brushSize
        ctxRef.current = ctx
      }
    }

    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas && ctxRef.current) {
        // Save current drawing
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext("2d")
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0)
        }

        // Resize canvas
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        // Restore drawing
        ctxRef.current.lineCap = "round"
        ctxRef.current.lineJoin = "round"
        ctxRef.current.strokeStyle = color
        ctxRef.current.lineWidth = brushSize
        ctxRef.current.drawImage(tempCanvas, 0, 0)
      }
    }

    window.addEventListener("resize", handleResize)

    socket.on("onDraw", ({ x, y, prevX, prevY, color, size, type }) => {
      const ctx = ctxRef.current
      if (!ctx) return

      ctx.strokeStyle = color
      ctx.lineWidth = size

      if (type === "start") {
        ctx.beginPath()
        ctx.moveTo(x, y)
      } else {
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    })

    socket.on("clearCanvas", () => {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    })

    return () => {
      window.removeEventListener("resize", handleResize)
      socket.off("onDraw")
      socket.off("clearCanvas")
    }
  }, [socket, color, brushSize])

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setLastPos({ x, y })

    socket.emit("draw", room, {
      x,
      y,
      prevX: x,
      prevY: y,
      color,
      size: brushSize,
      type: "start",
    })
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    socket.emit("draw", room, {
      x,
      y,
      prevX: lastPos.x,
      prevY: lastPos.y,
      color,
      size: brushSize,
      type: "drawing",
    })

    setLastPos({ x, y })
  }

  const endDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (canvas && ctx && canClear) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      socket.emit("clearCanvas", room)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full border ${color === c ? "ring-2 ring-offset-2 ring-indigo-500" : "border-gray-300"}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>

        <div className="h-6 border-l border-gray-300 mx-1"></div>

        <div className="flex items-center gap-1">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              className={`flex items-center justify-center w-6 h-6 rounded ${brushSize === size ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-100"}`}
              onClick={() => setBrushSize(size)}
              aria-label={`Brush size ${size}`}
            >
              <div
                className="rounded-full bg-current"
                style={{
                  width: Math.min(size, 16),
                  height: Math.min(size, 16),
                }}
              ></div>
            </button>
          ))}
        </div>

        <div className="h-6 border-l border-gray-300 mx-1"></div>

        <button
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
          onClick={clearCanvas}
          disabled={!canClear}
        >
          Clear
        </button>
      </div>

      <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="w-full h-[400px] cursor-crosshair touch-none"
        />
      </div>
    </div>
  )
}

