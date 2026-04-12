import CreateRoomButton from "@/components/room/CreateRoomButton"
import JoinRoomInput from "@/components/room/JoinRoomInput"
import { Divider } from "@/components/ui/divider"

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <CreateRoomButton />
      <Divider />
      <JoinRoomInput />
    </div>
  )
}
