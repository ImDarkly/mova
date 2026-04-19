import type { ReactNode } from "react"
import RoomHeader from "./RoomHeader"

interface RoomLayoutProps {
  roomId: string
  children: ReactNode
}

export default function RoomLayout({ roomId, children }: RoomLayoutProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-2">
      <RoomHeader roomId={roomId} />
      {children}
    </div>
  )
}
