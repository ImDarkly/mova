import { useNavigate } from "react-router"

export const useJoinRoom = () => {
  const navigate = useNavigate()

  return (roomId: string) => {
    navigate(`/room/${roomId}`)
  }
}
