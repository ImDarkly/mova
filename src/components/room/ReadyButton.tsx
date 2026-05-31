import { useReadyState } from "@/hooks/room/useReadyState"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface ReadyButtonProps {
  send: (data: { type: "READY" } | { type: "UNREADY" }) => boolean
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
