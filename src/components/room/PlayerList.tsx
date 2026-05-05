import type { Player } from "@/types/room"
import PlayerItem from "./PlayerItem"
import { getClientId } from "@/lib/clientId"

interface PlayerListProps {
  players: Player[]
}

export default function PlayerList({ players }: PlayerListProps) {
  const myId = getClientId()

  return (
    <div className="flex h-full w-auto flex-col justify-center gap-1">
      {players.map((player) => {
        return (
          <PlayerItem
            key={player.id}
            player={player}
            isMe={myId === player.id}
          />
        )
      })}
    </div>
  )
}
