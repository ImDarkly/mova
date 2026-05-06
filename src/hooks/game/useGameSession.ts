import { getClientId } from "@/lib/clientId"
import type { ServerMessage, TileType } from "@/types/room"
import usePartySocket from "partysocket/react"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function useGameSession(roomId: string) {
  const { t } = useTranslation("game")
  const navigate = useNavigate()
  const [tiles, setTiles] = useState<TileType[]>([])
  const intentionalClose = useRef(false)

  const socket = usePartySocket({
    host: import.meta.env.VITE_PARTYKIT_HOST ?? "localhost:1999",
    room: roomId,
    id: getClientId(),
    onMessage(event) {
      try {
        const msg = JSON.parse(event.data) as ServerMessage
        switch (msg.type) {
          case "RACK_STATE":
            setTiles(msg.tiles)
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
      intentionalClose.current = true
      toast.error(t("errors.connection.lost.title"), {
        description: t("errors.connection.lost.description"),
      })
      navigate("/")
    },
  })

  const send = (data: object) => socket.send(JSON.stringify(data))

  return { tiles, send }
}
