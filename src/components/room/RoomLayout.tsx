import type { ReactNode } from "react"
import RoomHeader from "./RoomHeader"
export default function RoomLayout({
  roomId,
  children,
  gameActions,
}: {
  roomId: string
  children: ReactNode
  gameActions?: ReactNode
}) {
  return (
    <div className="room-layout">
      <RoomHeader roomId={roomId} gameActions={gameActions} />
      {children}
    </div>
  )
}
