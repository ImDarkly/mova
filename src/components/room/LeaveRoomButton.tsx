import { LogOut } from "lucide-react"
import { useLeaveRoom } from "@/hooks/room/useLeaveRoom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LeaveRoomButton({
  open,
  onOpenChange,
  hideTrigger = false,
  onRequestLeave,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
  onRequestLeave?: () => void
}) {
  const { t } = useTranslation("room")
  const leaveRoom = useLeaveRoom()

  const handleLeave = () => {
    leaveRoom()
  }

  const trigger = (
    <Button variant="ghost" className="room-chip" onClick={onRequestLeave}>
      <LogOut size={18} />
      {t("actions.leaveRoom")}
    </Button>
  )
  if (onRequestLeave) return trigger

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialogs.leaveRoom.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialogs.leaveRoom.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("dialogs.leaveRoom.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleLeave}>
            {t("dialogs.leaveRoom.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
