import { generateRoomId } from "@/lib/roomId"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export const useCreateRoom = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const createRoom = () => {
    const roomId = generateRoomId()
    const url = `${window.location.origin}/game/${roomId}`

    navigator.clipboard.writeText(url)
    toast.success(t("room.success.title"), {
      description: t("room.success.description"),
    })

    navigate(`/game/${roomId}`)
  }

  return createRoom
}
