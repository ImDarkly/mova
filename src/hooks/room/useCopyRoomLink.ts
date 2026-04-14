import { useTranslation } from "react-i18next"
import { toast } from "sonner"

export const useCopyRoomLink = () => {
  const { t } = useTranslation("room")

  return (roomId: string) => {
    const url = `${window.location.origin}/room/${roomId}`
    try {
      navigator.clipboard.writeText(url)
      toast.success(t("status.success.copyRoomLink.title"), {
        description: t("status.success.copyRoomLink.description"),
      })
    } catch {
      toast.error(t("errors.clipboard.copyRoomLink.title"), {
        description: t("errors.clipboard.copyRoomLink.description"),
      })
    }
  }
}
