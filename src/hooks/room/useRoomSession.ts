import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useRef, useState } from "react"
import type { Player, ServerMessage } from "@/types/room"
import usePartySocket from "partysocket/react"

export function useRoomSession(roomId: string) {
  const { t } = useTranslation("room")
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>([])
  const [myId, setMyId] = useState<string | null>(null)
  const intentionalClose = useRef(false)

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
            intentionalClose.current = true
            socket.close()
            toast.error(t("events.roomFull.title"), {
              description: t("events.roomFull.description"),
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
    onError() {
      toast.error(t("errors.connection.failed.title"), {
        description: t("errors.connection.failed.description"),
      })
      navigate("/")
    },
    onClose() {
      if (intentionalClose.current) return
      toast.error(t("errors.connection.lost.title"), {
        description: t("errors.connection.lost.description"),
      })
      navigate("/")
    },
  })

  const send = (data: object) => socket.send(JSON.stringify(data))

  return { players, myId, send }
}
