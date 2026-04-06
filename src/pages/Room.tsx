import RoomHeader from "@/components/room/RoomHeader"
import { useParty } from "@/hooks/useParty"
import { useParams } from "react-router"

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>()
  useParty({ roomId: roomId! })

  if (!roomId) return null

  return <RoomHeader roomId={roomId} />
}
