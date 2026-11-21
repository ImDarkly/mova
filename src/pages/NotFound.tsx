import { Button } from "@/components/ui/button"
import TitleTiles from "@/components/TitleTiles"
import { House } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
export default function NotFound() {
  const { t } = useTranslation("errors")
  const navigate = useNavigate()
  return (
    <main className="page-shell">
      <div className="page-column">
        <TitleTiles word="LOST" />
        <h1 className="page-heading">{t("notFound.title")}</h1>
        <p className="page-copy">{t("notFound.description")}</p>
        <Button className="page-action" onClick={() => navigate("/")}>
          <House size={18} />
          {t("notFound.back")}
        </Button>
      </div>
    </main>
  )
}
