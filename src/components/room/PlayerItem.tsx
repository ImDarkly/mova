import type { Player } from "@/types/room"
import { useTranslation } from "react-i18next"
import Pawn from "@/components/Pawn"
import { Check } from "lucide-react"
export default function PlayerItem({
  player,
  isMe,
  index,
}: {
  player: Player
  isMe: boolean
  index: number
}) {
  const { t } = useTranslation("room")
  return (
    <div className="seat-row" style={{ opacity: player.connected ? 1 : 0.5 }}>
      <Pawn index={index} />
      <span className="min-w-0 truncate">{player.name}</span>
      {isMe && <span className="you-pill">{t("labels.you")}</span>}
      <span
        className={`status-chip ${player.ready && player.connected ? "ready" : ""}`}
      >
        {player.ready && player.connected && <Check size={14} />}{" "}
        {t(
          !player.connected
            ? "player.away"
            : player.ready
              ? "player.ready"
              : "player.notReady"
        )}
      </span>
    </div>
  )
}
