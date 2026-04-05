import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export const useCopyRoomLink = () => {
  const { t } = useTranslation("room")

  return (roomId: string) => {
    const url = `${window.location.origin}/room/${roomId}`
    navigator.clipboard.writeText(url)
    toast.success(t("success.title"), {
      description: t("success.description"),
    })
  }
}
