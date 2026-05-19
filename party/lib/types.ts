export interface Tile {
  letter: string
  points: number
}

export interface Player {
  id: string
  ready: boolean
  rack: Tile[]
  connected: boolean
}

export type PublicPlayer = Omit<Player, "rack">

export function toPublicPlayer(p: Player): PublicPlayer {
  const { rack: _, ...pub } = p
  return pub
}
