import Board from "@/components/game/Board"

export default function Game() {
  return (
    <div className="@container-[size] flex h-full w-full flex-col items-center justify-center gap-1">
      <Board />
    </div>
  )
}
