import { generateRoomId } from "@/lib/roomId"
import { useNavigate } from "react-router"
import { useCopyRoomLink } from "./useCopyRoomLink"

export const useCreateRoom = () => {
  const navigate = useNavigate()
  const copyRoom = useCopyRoomLink()

  return () => {
    const roomId = generateRoomId()
    copyRoom(roomId)
    navigate(`/room/${roomId}`)
  }
}
