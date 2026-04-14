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
import { Hash } from "lucide-react"
import { ROOM_CODE_LENGTH } from "@/lib/roomId"

export default function JoinRoomInput() {
  const { t } = useTranslation("room")
  const [code, setCode] = useState("")
  const joinRoom = useJoinRoom()

  const handleJoin = () => {
    joinRoom(code)
  }

  return (
    <div className="flex flex-col gap-2">
      <InputOTP
        maxLength={ROOM_CODE_LENGTH}
        value={code}
        onChange={(value) => setCode(value.toUpperCase())}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        inputMode="text"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-l-full border border-r-0 border-input bg-input">
          <Hash size={16} />
        </div>
        <InputOTPGroup>
          <InputOTPSlot key={0} index={0} className="first:rounded-none" />
          {Array.from({ length: ROOM_CODE_LENGTH - 1 }).map((_, i) => (
            <InputOTPSlot key={i + 1} index={i + 1} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button
        disabled={code.length !== ROOM_CODE_LENGTH}
        variant="secondary"
        onClick={handleJoin}
      >
        {t("actions.joinRoom")}
      </Button>
    </div>
  )
}
