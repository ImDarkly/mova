import type { Player } from "@/types/room"
import { useTranslation } from "react-i18next"
import { Item, ItemContent, ItemTitle } from "../ui/item"
import { Badge } from "../ui/badge"

interface PlayerItemProps {
  player: Player
  isMe: boolean
}

export default function PlayerItem({ player, isMe }: PlayerItemProps) {
  const { t } = useTranslation("room")

  return (
    <Item
      variant={player.ready ? "muted" : isMe ? "outline" : "default"}
      className="w-auto"
    >
      <ItemContent>
        <ItemTitle>
          {player.id}
          {isMe && <Badge variant="outline">{t("labels.you")}</Badge>}
        </ItemTitle>
      </ItemContent>
      <ItemContent>
        <Badge variant={player.ready ? "default" : "secondary"}>
          {t(player.ready ? "player.ready" : "player.notReady")}
        </Badge>
      </ItemContent>
    </Item>
  )
}
