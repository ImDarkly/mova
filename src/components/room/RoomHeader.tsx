import LeaveRoomButton from "@/components/room/LeaveRoomButton"
import RoomIdDisplay from "@/components/room/RoomIdDisplay"

interface RoomHeaderProps {
  roomId: string
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  return (
    <div className="flex h-16 w-full items-center justify-between gap-2">
      <RoomIdDisplay roomId={roomId} />
      <LeaveRoomButton />
    </div>
  )
}
