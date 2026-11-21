import { useTranslation } from "react-i18next"
import type { Player } from "@/types/room"
import ScoreBoardItem from "./ScoreBoardItem"
import { getClientId } from "@/lib/clientId"

interface ScoreBoardListProps {
  players: Player[]
  currentTurn?: string
  scores: Record<string, number>
}

export default function ScoreBoardList({
  players,
  currentTurn,
  scores,
}: ScoreBoardListProps) {
  const myId = getClientId()
  const { t } = useTranslation("game")

  return (
    <aside className="players-panel" aria-label={t("labels.players")}>
      <h2 className="players-title">{t("labels.players")}</h2>
      <div className="players-list">
        {players.map((player, index) => {
          return (
            <ScoreBoardItem
              key={player.id}
              index={index}
              player={player}
              isMe={myId === player.id}
              currentTurn={currentTurn}
              score={scores[player.id] ?? 0}
            />
          )
        })}
      </div>
    </aside>
  )
}
