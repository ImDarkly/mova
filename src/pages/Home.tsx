import CreateRoomButton from "@/components/room/CreateRoomButton"
import JoinRoomInput from "@/components/room/JoinRoomInput"
import { Divider } from "@/components/ui/divider"
import { useTranslation } from "react-i18next"

export default function Home() {
  const { t } = useTranslation("common")

  return (
    <div className="flex flex-col gap-4">
      <CreateRoomButton />
      <Divider label={t("or")} />
      <JoinRoomInput />
    </div>
  )
}
