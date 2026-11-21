import type { ReactNode } from "react"
import RoomHeader from "./RoomHeader"
export default function RoomLayout({
  roomId,
  children,
  gameActions,
  onLeave,
}: {
  roomId: string
  children: ReactNode
  gameActions?: ReactNode
  onLeave?: () => void
}) {
  return (
    <div className="room-layout">
      <RoomHeader roomId={roomId} gameActions={gameActions} onLeave={onLeave} />
      {children}
    </div>
  )
}
