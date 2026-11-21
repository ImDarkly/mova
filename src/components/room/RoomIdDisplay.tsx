import { useCopyRoomLink } from "@/hooks/room/useCopyRoomLink"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { Copy } from "lucide-react"
export default function RoomIdDisplay({ roomId }: { roomId: string }) {
  const { t } = useTranslation("room")
  const copy = useCopyRoomLink()
  return (
    <Button
      className="room-chip"
      variant="ghost"
      onClick={() => copy(roomId)}
      aria-label={t("actions.copyInviteForRoom", {
        room: t("labels.room"),
        roomId,
      })}
    >
      <span>
        {t("labels.room")} <b className="tracking-widest">{roomId}</b>
      </span>
      <Copy size={18} strokeWidth={2.2} />
    </Button>
  )
}
