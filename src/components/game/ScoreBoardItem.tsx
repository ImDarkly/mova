import type { Player } from "@/types/room"
import { useTranslation } from "react-i18next"
import Pawn from "@/components/Pawn"
export default function ScoreBoardItem({
  player,
  isMe,
  currentTurn,
  score,
  index,
}: {
  player: Player
  isMe: boolean
  currentTurn?: string
  score: number
  index: number
}) {
  const { t } = useTranslation("game")
  const turn = player.id === currentTurn
  return (
    <div
      className={`player-score ${turn ? "current-player" : ""}`}
      aria-current={turn ? "step" : undefined}
    >
      <Pawn index={index} />
      <div className="player-name">
        <span
          className="block truncate"
          style={{ opacity: player.connected ? 1 : 0.5 }}
        >
          {player.name}
        </span>
        {!player.connected && (
          <span className="sr-only">{t("labels.disconnected")}</span>
        )}
        {isMe && <span className="self-marker">{t("labels.you")}</span>}
        {turn && <span className="playing-label">{t("labels.playing")}</span>}
      </div>
      <span className="player-points">{score}</span>
    </div>
  )
}
