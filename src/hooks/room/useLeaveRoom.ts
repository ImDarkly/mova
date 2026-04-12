import { useNavigate } from "react-router"

export const useLeaveRoom = () => {
  const navigate = useNavigate()

  return () => {
    // TODO: notify PartyKit other players you left
    navigate("/")
  }
}
