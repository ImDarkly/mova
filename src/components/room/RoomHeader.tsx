import LeaveRoomButton from "./LeaveRoomButton"
import RoomIdDisplay from "./RoomIdDisplay"

interface RoomHeaderProps {
  roomId: string
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  return (
    <div className="flex w-full gap-2">
      <RoomIdDisplay roomId={roomId} />
      <LeaveRoomButton />
    </div>
  )
}
