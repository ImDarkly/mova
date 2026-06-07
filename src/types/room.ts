export interface Player {
  id: string
  name: string
  ready: boolean
  connected: boolean
  score: number
}

export type PlayerStatus = "ready" | "not-ready" | "your-turn" | "their-turn"
