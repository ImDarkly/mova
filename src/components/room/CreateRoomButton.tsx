import { useCreateRoom } from "@/hooks/useCreateRoom"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"

export default function CreateRoomButton() {
  const { t } = useTranslation()
  const createRoom = useCreateRoom()

  return <Button onClick={createRoom}>{t("room.createRoom")}</Button>
}
