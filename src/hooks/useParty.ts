import PartySocket, { WebSocket } from "partysocket"
import { useEffect, useRef, useState } from "react"

export function useParty({ roomId }: { roomId: string }) {
  const socketRef = useRef<PartySocket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = new PartySocket({
      host: import.meta.env.VITE_PARTYKIT_HOST ?? "localhost:1999",
      room: roomId,
    })

    socket.onopen = () => setConnected(true)
    socket.onclose = () => setConnected(false)
    socket.onerror = () => setConnected(false)

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        console.log("message:", msg)
      } catch {
        console.log("non-JSON message:", event.data)
      }
    }

    socketRef.current = socket
    return () => socket.close()
  }, [roomId])

  const send = (data: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data))
    }
  }

  return { connected, send }
}
