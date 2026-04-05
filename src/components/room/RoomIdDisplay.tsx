import { useCopyRoomLink } from "@/hooks/useCopyRoomLink"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface RoomIdDisplayProps {
  roomId: string
}

export default function RoomIdDisplay({ roomId }: RoomIdDisplayProps) {
  const { t } = useTranslation("room")
  const copyRoomLink = useCopyRoomLink()

  const handleCopy = () => {
    copyRoomLink(roomId)
  }

  return (
    <div className="flex gap-1">
      <Input readOnly value={roomId} className="w-auto" />
      <Button variant="secondary" onClick={handleCopy}>
        {t("copyRoomLink")}
      </Button>
    </div>
  )
}
