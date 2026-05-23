export interface Player {
  id: string
  ready: boolean
}

export type PlayerStatus = "ready" | "not-ready" | "your-turn" | "their-turn"
