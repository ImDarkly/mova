import { useCreateRoom } from "@/hooks/useCreateRoom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export default function CreateRoomButton() {
  const { t } = useTranslation("room")
  const createRoom = useCreateRoom()

  return <Button onClick={createRoom}>{t("createRoom")}</Button>
}
