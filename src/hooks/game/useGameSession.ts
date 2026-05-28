import { getClientId } from "@/lib/clientId"
import type { TileType } from "@/types/game"
import type { ServerMessage } from "@/types/messages"
import type { Player } from "@/types/room"
import usePartySocket from "partysocket/react"
import { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export function useGameSession(roomId: string) {
  const { t } = useTranslation("game")
  const navigate = useNavigate()
  const [tiles, setTiles] = useState<TileType[]>([])
  const intentionalClose = useRef(false)
  const myId = getClientId()
  const [currentTurn, setCurrentTurn] = useState<string>("")
  const [players, setPlayers] = useState<Player[]>([])
  const [boardTiles, setBoardTiles] = useState<Record<string, TileType>>({})

  const socket = usePartySocket({
    host: `${window.location.hostname}:1999`,
    room: roomId,
    id: myId,
    onMessage(event) {
      try {
        const msg = JSON.parse(event.data) as ServerMessage
        switch (msg.type) {
          case "RACK_STATE":
            setTiles(msg.tiles)
            break
          case "TURN_CHANGE":
            setCurrentTurn(msg.currentTurn)
            break
          case "ROOM_STATE":
            setPlayers(msg.players)
            break
          case "GAME_START":
            setCurrentTurn(msg.currentTurn)
            break
          case "BOARD_STATE":
            setBoardTiles(msg.board)
            break
          case "SUBMIT_ERROR": {
            const title = t(
              `errors.submit.${msg.error}.title`,
              "Submission Error"
            )
            const description = t(
              `errors.submit.${msg.error}.description`,
              "An error occurred while submitting."
            )

            toast.error(title, { description })
            break
          }
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
      intentionalClose.current = true
      toast.error(t("errors.connection.lost.title"), {
        description: t("errors.connection.lost.description"),
      })
      navigate("/")
    },
  })

  const send = useCallback(
    (data: object) => socket.send(JSON.stringify(data)),
    [socket]
  )

  const isMyTurn = currentTurn === myId

  return { tiles, players, currentTurn, isMyTurn, boardTiles, send }
}
