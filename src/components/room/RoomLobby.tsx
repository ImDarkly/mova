import PlayerList from "./PlayerList"
import type { Player } from "@/types/room"
import ReadyButton from "./ReadyButton"

interface RoomLobbyProps {
  players: Player[]
  send: (data: { type: "READY" } | { type: "UNREADY" }) => boolean
}

export default function RoomLobby({ players, send }: RoomLobbyProps) {
  return (
    <div className="flex h-full w-auto flex-col items-center">
      <PlayerList players={players} />
      <ReadyButton send={send} />
    </div>
  )
}
