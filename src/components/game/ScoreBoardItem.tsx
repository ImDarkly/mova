import type { Player } from "@/types/room"
import { useTranslation } from "react-i18next"
import { Item, ItemContent, ItemTitle } from "../ui/item"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

interface ScoreBoardItemProps {
  player: Player
  isMe: boolean
  currentTurn?: string
  score: number
}

export default function ScoreBoardItem({
  player,
  isMe,
  currentTurn,
  score,
}: ScoreBoardItemProps) {
  const { t } = useTranslation("game")
  const isTurnHolder = player.id === currentTurn

  return (
    <Item
      variant={isMe ? "muted" : "default"}
      className={cn("w-auto", isTurnHolder ? "ring-2 ring-primary" : null)}
    >
      <ItemContent>
        <ItemTitle>
          {player.id}
          {isMe && <Badge variant="outline">{t("labels.you")}</Badge>}
        </ItemTitle>
      </ItemContent>
      <ItemContent>
        <span>{score}</span>
      </ItemContent>
    </Item>
  )
}
