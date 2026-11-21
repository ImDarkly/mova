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
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}) {
  const { t } = useTranslation("room")
  const leaveRoom = useLeaveRoom()

  const handleLeave = () => {
    leaveRoom()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <AlertDialogTrigger
          render={
            <Button variant="ghost" className="room-chip">
              <LogOut size={18} />
              {t("actions.leaveRoom")}
            </Button>
          }
        />
      )}
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
