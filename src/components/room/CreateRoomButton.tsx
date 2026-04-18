import { useCreateRoom } from "@/hooks/room/useCreateRoom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export default function CreateRoomButton() {
  const { t } = useTranslation("room")
  const createRoom = useCreateRoom()

  return <Button onClick={createRoom}>{t("actions.createRoom")}</Button>
}
