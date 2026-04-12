import { generateRoomId } from "@/lib/roomId"
import { useNavigate } from "react-router"
import { useCopyRoomLink } from "@/hooks/room/useCopyRoomLink"

export const useCreateRoom = () => {
  const navigate = useNavigate()
  const copyRoomLink = useCopyRoomLink()

  return () => {
    const roomId = generateRoomId()
    copyRoomLink(roomId)
    navigate(`/room/${roomId}`)
  }
}
