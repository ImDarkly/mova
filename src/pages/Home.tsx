import CreateRoomButton from "@/components/room/CreateRoomButton"
import JoinRoomInput from "@/components/room/JoinRoomInput"
import { Divider } from "@/components/ui/divider"
import { Input } from "@/components/ui/input"
import { getPlayerName, setPlayerName } from "@/lib/playerName"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function Home() {
  const { t } = useTranslation("common")
  const [name, setName] = useState(getPlayerName() ?? "")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (val.trim()) setPlayerName(val.trim())
  }

  const ready = name.trim().length > 0

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Your name"
        value={name}
        onChange={handleNameChange}
        maxLength={20}
      />
      <CreateRoomButton disabled={!ready} />
      <Divider label={t("or")} />
      <JoinRoomInput disabled={!ready} />
    </div>
  )
}
