import { useJoinRoom } from "@/hooks/room/useJoinRoom"
import { useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { ROOM_CODE_LENGTH } from "@/lib/roomId"
export default function JoinRoomInput({ disabled }: { disabled?: boolean }) {
  const { t } = useTranslation("room")
  const [code, setCode] = useState("")
  const joinRoom = useJoinRoom()
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="room-code">{t("labels.roomCode")}</label>
      <InputOTP
        id="room-code"
        maxLength={ROOM_CODE_LENGTH}
        value={code}
        onChange={(v) => setCode(v.toUpperCase())}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        inputMode="text"
        containerClassName="w-full"
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !disabled &&
            code.length === ROOM_CODE_LENGTH
          )
            joinRoom(code)
        }}
      >
        <InputOTPGroup className="otp-group">
          {Array.from({ length: ROOM_CODE_LENGTH }, (_, i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button
        className="card-secondary"
        disabled={disabled || code.length !== ROOM_CODE_LENGTH}
        onClick={() => joinRoom(code)}
      >
        {t("actions.joinRoom")}
      </Button>
    </div>
  )
}
