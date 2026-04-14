import type { Player } from "@/types/room"
import PlayerItem from "./PlayerItem"

interface PlayerListProps {
  players: Player[]
  myId: string
}

export default function PlayerList({ players, myId }: PlayerListProps) {
  return (
    <div className="flex h-full w-auto flex-col justify-center gap-1">
      {players.map((player) => {
        const isMe = player.id === myId

        return <PlayerItem key={player.id} player={player} isMe={isMe} />
      })}
    </div>
  )
}
