import { useReadyState } from "@/hooks/room/useReadyState"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface ReadyButtonProps {
  send: (data: object) => void
}

export default function ReadyButton({ send }: ReadyButtonProps) {
  const { t } = useTranslation("room")
  const { ready, toggle } = useReadyState(send)

  return (
    <Button onClick={toggle} variant={ready ? "secondary" : "default"}>
      {ready ? t("player.notReady") : t("player.ready")}
    </Button>
  )
}
