import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
export default function ReadyButton({
  ready,
  toggle,
}: {
  ready: boolean
  toggle: () => void
}) {
  const { t } = useTranslation("room")
  return (
    <Button
      className={`page-action ${ready ? "room-chip" : ""}`}
      onClick={toggle}
      variant={ready ? "ghost" : "default"}
    >
      {t(ready ? "player.notReady" : "actions.imReady")}
    </Button>
  )
}
