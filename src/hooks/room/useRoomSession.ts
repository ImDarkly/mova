import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useState } from "react"
import type { Player, ServerMessage } from "@/types/room"
import usePartySocket from "partysocket/react"

export function useRoomSession(roomId: string) {
  const { t } = useTranslation("room")
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>([])
  const [myId, setMyId] = useState<string | null>(null)

  const socket = usePartySocket({
    host: import.meta.env.VITE_PARTYKIT_HOST ?? "localhost:1999",
    room: roomId,
    onMessage(event) {
      try {
        const msg = JSON.parse(event.data) as ServerMessage
        switch (msg.type) {
          case "JOINED":
            setMyId(msg.myId)
            break
          case "ROOM_FULL":
            socket.close()
            toast.error(t("roomFull.title"), {
              description: t("roomFull.description"),
            })
            navigate("/")
            break
          case "ROOM_STATE":
            setPlayers(msg.players)
            break
          case "GAME_START":
            navigate(`/game/${roomId}`)
            break
        }
      } catch {
        console.log("non-JSON message:", event.data)
      }
    },
  })

  const send = (data: object) => socket.send(JSON.stringify(data))

  return { players, myId, send }
}
