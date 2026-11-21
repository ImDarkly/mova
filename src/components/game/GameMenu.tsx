import { Menu } from "@base-ui/react/menu"
import { Ellipsis, SkipForward, Copy, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCopyRoomLink } from "@/hooks/room/useCopyRoomLink"
import { useTranslation } from "react-i18next"
export default function GameMenu({
  roomId,
  disabled,
  onSkip,
  onLeave,
}: {
  roomId: string
  disabled: boolean
  onSkip: () => void
  onLeave: () => void
}) {
  const { t } = useTranslation("game")
  const { t: room } = useTranslation("room")
  const copy = useCopyRoomLink()
  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="room-chip lg:hidden"
            aria-label={t("actions.more")}
          />
        }
      >
        <Ellipsis size={18} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-40">
          <Menu.Popup className="game-menu">
            <Menu.Item disabled={disabled} onClick={onSkip}>
              <SkipForward />
              {t("actions.skip")}
            </Menu.Item>
            <Menu.Item onClick={() => copy(roomId)}>
              <Copy />
              {room("actions.copyInvite")}
            </Menu.Item>
            <Menu.Separator className="my-1 h-px bg-border" />
            <Menu.Item className="text-destructive" onClick={onLeave}>
              <LogOut />
              {t("actions.leave")}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
