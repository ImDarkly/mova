import { RACK_SIZE, TILE_DISTRIBUTION } from "../constants"
import { Tile } from "./types"

export function buildBag(): Tile[] {
  const bag: Tile[] = []
  for (const { letter, points, count } of TILE_DISTRIBUTION) {
    for (let i = 0; i < count; i++) {
      bag.push({ letter, points })
    }
  }
  return bag
}

export function shuffleBag(bag: Tile[]): Tile[] {
  const shuffled = [...bag]
  const rand = new Uint32Array(1)
  for (let i = shuffled.length - 1; i > 0; i--) {
    crypto.getRandomValues(rand)
    const j = rand[0] % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function drawTiles(
  bag: Tile[],
  count: number
): { drawn: Tile[]; remaining: Tile[] } {
  const remaining = [...bag]
  const drawn = remaining.splice(0, Math.min(count, remaining.length))
  return { drawn, remaining }
}

export function refillRack(
  rack: Tile[],
  bag: Tile[]
): { rack: Tile[]; bag: Tile[] } {
  const needed = RACK_SIZE - rack.length
  if (needed <= 0 || bag.length === 0) return { rack, bag }
  const { drawn, remaining } = drawTiles(bag, needed)
  return { rack: [...rack, ...drawn], bag: remaining }
}
