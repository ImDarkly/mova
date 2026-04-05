import { useCopyRoomLink } from "@/hooks/useCopyRoomLink"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
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
    <div className="flex w-full gap-1">
      <Input readOnly value={roomId} className="font-mono" />
      <Button onClick={handleCopy}>{t("copyRoomLink")}</Button>
    </div>
  )
}
