import PlayerList from "./PlayerList"
import type { Player } from "@/types/room"
import ReadyButton from "./ReadyButton"
import { useReadyState } from "@/hooks/room/useReadyState"
import { useCopyRoomLink } from "@/hooks/room/useCopyRoomLink"
import { getClientId } from "@/lib/clientId"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { UserPlus, Copy } from "lucide-react"
export default function RoomLobby({
  players,
  send,
  roomId,
}: {
  players: Player[]
  roomId: string
  send: (data: { type: "READY" } | { type: "UNREADY" }) => boolean
}) {
  const { t } = useTranslation("room")
  const { t: common } = useTranslation("common")
  const { ready, toggle } = useReadyState(send)
  const copy = useCopyRoomLink()
  const waiting = players
    .filter((p) => p.id !== getClientId() && !p.ready)
    .map((p) => p.name)
  const names =
    waiting.length > 1
      ? waiting.slice(0, -1).join(", ") + ` ${common("and")} ` + waiting.at(-1)
      : waiting[0]
  return (
    <main className="page-shell min-h-0 flex-1 !p-0">
      <div className="page-column">
        <h1 className="page-heading">{t("labels.gather")}</h1>
        <div className="page-copy" aria-live="polite">
          <p>
            {ready && waiting.length
              ? t("labels.waiting", { names })
              : t("labels.startsReady")}
          </p>
          <p>
            {t("labels.readyCount", {
              ready: players.filter((p) => p.ready).length,
              total: players.length,
            })}
          </p>
        </div>
        <PlayerList players={players} />
        <div className="invite-row">
          <UserPlus size={20} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">{t("labels.invite")}</p>
            <p className="truncate text-xs text-muted-foreground">
              {window.location.origin}/room/{roomId}
            </p>
          </div>
          <Button variant="ghost" onClick={() => copy(roomId)}>
            <Copy size={18} />
            {t("actions.copyRoomLink")}
          </Button>
        </div>
        <ReadyButton ready={ready} toggle={toggle} />
      </div>
    </main>
  )
}
