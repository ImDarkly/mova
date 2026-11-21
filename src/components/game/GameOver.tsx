import type { Player } from "@/types/room"
import { getClientId } from "@/lib/clientId"
import Pawn from "@/components/Pawn"
import { Button } from "@/components/ui/button"
import { Crown, House } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
export default function GameOver({
  players,
  result,
}: {
  players: Player[]
  result: { winnerIds: string[]; scores: Record<string, number> }
}) {
  const { t, i18n } = useTranslation("game")
  const navigate = useNavigate()
  const me = getClientId()
  const sorted = [...players].sort(
    (a, b) => (result.scores[b.id] ?? 0) - (result.scores[a.id] ?? 0)
  )
  const score = result.scores[me] ?? 0
  const place =
    1 + players.filter((p) => (result.scores[p.id] ?? 0) > score).length
  const category = new Intl.PluralRules(i18n.resolvedLanguage ?? "en", {
    type: "ordinal",
  }).select(place)
  const ordinal = t(`labels.gameOver.ordinal_${category}`, { count: place })
  const heading =
    result.winnerIds.length > 1
      ? t("labels.gameOver.tie")
      : result.winnerIds.includes(me)
        ? t("labels.gameOver.win")
        : t("labels.gameOver.winner", {
            name: players.find((p) => p.id === result.winnerIds[0])?.name ?? "",
          })
  return (
    <main className="page-shell">
      <div className="page-column">
        <Crown className="mx-auto size-11 text-[#ffc074]" aria-hidden="true" />
        <h1 className="page-heading">{heading}</h1>
        <p className="page-copy">
          {t("labels.gameOver.finished", { place: ordinal, score })}
        </p>
        <div className="piece-card">
          {sorted.map((p) => {
            const points = result.scores[p.id] ?? 0
            const rank =
              1 +
              sorted.filter((other) => (result.scores[other.id] ?? 0) > points)
                .length
            return (
              <div
                key={p.id}
                className={`seat-row ranking-row ${result.winnerIds.includes(p.id) ? "winner-row" : ""} ${p.id === me ? "my-ranking" : ""}`}
              >
                <span className="rank-number">{rank}</span>
                <Pawn index={players.findIndex((other) => other.id === p.id)} />
                <span className="truncate">
                  {p.id === me ? t("labels.you") : p.name}
                </span>
                <span className="ml-auto text-lg font-black tabular-nums">
                  {points}
                </span>
              </div>
            )
          })}
        </div>
        <Button className="page-action" onClick={() => navigate("/")}>
          <House size={18} />
          {t("labels.gameOver.goHome")}
        </Button>
      </div>
    </main>
  )
}
