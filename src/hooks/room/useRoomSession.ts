import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useRef, useState } from "react"
import type { Player } from "@/types/room"
import usePartySocket from "partysocket/react"
import { getClientId } from "@/lib/clientId"
import type { ServerMessage } from "@/types/messages"
import { WebSocket } from "partysocket"
import { getPlayerName } from "@/lib/playerName"

export function useRoomSession(roomId: string) {
  const { t } = useTranslation("room")
  const navigate = useNavigate()
  const [players, setPlayers] = useState<Player[]>([])
  const intentionalClose = useRef(false)

  const socket = usePartySocket({
    host: `${window.location.hostname}:1999`,
    room: roomId,
    id: getClientId(),
    query: {
      name: getPlayerName() ?? "",
    },
    onMessage(event) {
      try {
        const msg = JSON.parse(event.data) as ServerMessage
        switch (msg.type) {
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
      intentionalClose.current = true
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

  const send = (data: object): boolean => {
    if (socket.readyState !== WebSocket.OPEN) return false
    try {
      socket.send(JSON.stringify(data))
      return true
    } catch (error) {
      console.error("Failed to send message:", error)
      return false
    }
  }

  return { players, send }
}
