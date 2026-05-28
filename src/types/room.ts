export interface Player {
  id: string
  ready: boolean
  connected: boolean
}

export type PlayerStatus = "ready" | "not-ready" | "your-turn" | "their-turn"
