import type { Player } from "@/types/room"
import PlayerItem from "./PlayerItem"
import { getClientId } from "@/lib/clientId"
import { MAX_PLAYERS } from "@/lib/room"
import { useTranslation } from "react-i18next"
export default function PlayerList({ players }: { players: Player[] }) {
  const { t } = useTranslation("room")
  return (
    <div className="piece-card">
      {players.map((p, i) => (
        <PlayerItem
          key={p.id}
          player={p}
          isMe={p.id === getClientId()}
          index={i}
        />
      ))}
      {Array.from(
        { length: Math.max(0, MAX_PLAYERS - players.length) },
        (_, i) => (
          <div key={i} className="seat-row seat-empty">
            <span className="pawn" aria-hidden="true" />
            {t("labels.emptySeat")}
          </div>
        )
      )}
    </div>
  )
}
