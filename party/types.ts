export interface Player {
  id: string
  ready: boolean
}
export type Players = Record<string, Player>
