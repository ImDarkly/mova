import CreateRoomButton from "@/components/room/CreateRoomButton"
import JoinRoomInput from "@/components/room/JoinRoomInput"
import TitleTiles from "@/components/TitleTiles"
import { getPlayerName, setPlayerName } from "@/lib/playerName"
import { useState } from "react"
import { useTranslation } from "react-i18next"
export default function Home() {
  const { t } = useTranslation("common")
  const [name, setName] = useState(getPlayerName() ?? "")
  return (
    <main className="page-shell">
      <div className="page-column">
        <header>
          <h1 className="sr-only">mova</h1>
          <TitleTiles word="MOVA" />
          <p className="page-copy">{t("tagline")}</p>
        </header>
        <section className="piece-card">
          <div>
            <label htmlFor="player-name">{t("nameInput")}</label>
            <input
              id="player-name"
              autoComplete="nickname"
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (e.target.value.trim()) setPlayerName(e.target.value.trim())
              }}
              maxLength={20}
              aria-describedby="name-helper"
            />
            <p id="name-helper" className="card-helper">
              {t("nameHelper")}
            </p>
          </div>
          <CreateRoomButton disabled={!name.trim()} />
          <div className="card-divider">{t("orJoin")}</div>
          <JoinRoomInput disabled={!name.trim()} />
        </section>
      </div>
      <div className="loose-tiles" aria-hidden="true">
        {["W", "R", "D"].map((l) => (
          <span key={l} className="title-tile">
            {l}
            <small>{l === "W" ? 4 : l === "D" ? 2 : 1}</small>
          </span>
        ))}
      </div>
    </main>
  )
}
