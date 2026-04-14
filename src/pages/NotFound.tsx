import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"

export default function NotFound() {
  const { t } = useTranslation("errors")
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-1">
      <h1>{t("notFound.title")}</h1>
      <Button onClick={() => navigate("/")}>{t("notFound.back")}</Button>
    </div>
  )
}
