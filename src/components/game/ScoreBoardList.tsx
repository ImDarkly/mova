import type { Player } from "@/types/room"
import ScoreBoardItem from "./ScoreBoardItem"
import { getClientId } from "@/lib/clientId"

interface ScoreBoardItemProps {
  players: Player[]
  currentTurn?: string
}

export default function ScoreBoardList({
  players,
  currentTurn,
}: ScoreBoardItemProps) {
  const myId = getClientId()

  return (
    <div className="flex w-auto flex-col justify-center gap-1">
      {players.map((player) => {
        return (
          <ScoreBoardItem
            key={player.id}
            player={player}
            isMe={myId === player.id}
            currentTurn={currentTurn}
          />
        )
      })}
    </div>
  )
}
