import type { ReactNode } from "react"
import LeaveRoomButton from "./LeaveRoomButton"
import RoomIdDisplay from "./RoomIdDisplay"
export default function RoomHeader({
  roomId,
  gameActions,
}: {
  roomId: string
  gameActions?: ReactNode
}) {
  return (
    <header className="room-header">
      {gameActions && (
        <span className="hidden text-xl font-black lg:block">
          mova<span className="text-[#ffb36b]">.</span>
        </span>
      )}
      <div
        className={`flex w-full items-center justify-between gap-2 ${gameActions ? "lg:ml-auto lg:w-auto" : ""}`}
      >
        <RoomIdDisplay roomId={roomId} />
        {gameActions ? (
          <>
            <div className="hidden lg:block">
              <LeaveRoomButton />
            </div>
            {gameActions}
          </>
        ) : (
          <LeaveRoomButton />
        )}
      </div>
    </header>
  )
}
