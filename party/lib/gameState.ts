import { BOARD_SIZE, MAX_PLAYERS, MIN_PLAYERS, RACK_SIZE } from "../constants"
import { buildBag, drawTiles, refillRack, shuffleBag } from "./bag"
import { isPlacement, type Player, type Tile } from "./types"
import { advanceToNextConnectedPlayer, findFirstConnectedPlayer } from "./turns"
import { calculateTurnScore, extractWordsFormed } from "./wordExtraction"
import {
  isValidWithBlank,
  validatePlacements,
  type ValidationError,
} from "./validation"

export interface PlayerConnectResult {
  isNewPlayer: boolean
  isRoomFull: boolean
}

export interface ToggleReadyResult {
  shouldStartGame: boolean
}

export type SubmitTurnResult =
  | { success: true; turnScore: number }
  | { success: false; error: ValidationError }

export interface HandleReconnectResult {
  gameOver: boolean
  currentTurn: string | null
  scores: Record<string, number>
  board: (Tile | null)[][]
  winnerIds: string[]
}

export class GameState {
  players: Record<string, Player> = {}
  board: (Tile | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  )
  bag: Tile[] = []
  gameStarted = false
  gameOver = false
  winnerIds: string[] = []
  playerOrder: string[] = []
  currentTurn: string | null = null

  playerConnect(playerId: string, playerName: string): PlayerConnectResult {
    const isNewPlayer = !this.players[playerId]

    if (isNewPlayer) {
      if (this.gameStarted || Object.keys(this.players).length >= MAX_PLAYERS) {
        return { isNewPlayer: true, isRoomFull: true }
      }
      this.playerOrder.push(playerId)
      this.players[playerId] = {
        id: playerId,
        name: playerName,
        ready: false,
        rack: [],
        connected: true,
        score: 0,
      }
    } else {
      const player = this.players[playerId]
      player.connected = true
    }

    return { isNewPlayer, isRoomFull: false }
  }

  playerDisconnect(playerId: string): void {
    const player = this.players[playerId]

    if (this.gameStarted) {
      if (player) {
        player.connected = false
        if (this.currentTurn === playerId) {
          this.currentTurn = advanceToNextConnectedPlayer(
            this.playerOrder,
            this.players,
            this.currentTurn
          )
        }
      }
      return
    }

    delete this.players[playerId]
    this.playerOrder = this.playerOrder.filter((id) => id !== playerId)
  }

  toggleReady(playerId: string, ready: boolean): ToggleReadyResult {
    const player = this.players[playerId]
    if (!player) {
      return { shouldStartGame: false }
    }

    if (this.gameStarted) {
      return { shouldStartGame: false }
    }

    player.ready = ready
    const list = Object.values(this.players)
    const shouldStartGame =
      list.length >= MIN_PLAYERS && list.every((p) => p.ready)

    if (shouldStartGame) {
      this.startGame()
    }

    return { shouldStartGame }
  }

  submitTurn(playerId: string, placements: unknown): SubmitTurnResult {
    const player = this.players[playerId]

    const validatedPlacements = Array.isArray(placements)
      ? placements.filter(isPlacement)
      : []

    // Validate geometry and connectivity before modifying any game state
    // to ensure an "atomic" operation—if anything fails, the board remains unchanged.
    const geomResult = validatePlacements(validatedPlacements, this.board)
    if (!geomResult.valid) {
      return { success: false, error: geomResult }
    }

    // Verify all newly formed words against the dictionary.
    // Validation must run before state update to reject illegal moves.
    const newTiles = validatedPlacements.map(
      ({ rackIndex }) => player.rack[rackIndex]
    )

    // Validate rackIndex bounds and uniqueness
    const rackIndices = new Set<number>()
    for (const { rackIndex } of validatedPlacements) {
      if (rackIndex < 0 || rackIndex >= player.rack.length) {
        return {
          success: false,
          error: { valid: false, error: "OUT_OF_BOUNDS" },
        }
      }
      if (rackIndices.has(rackIndex)) {
        return {
          success: false,
          error: { valid: false, error: "DUPLICATE_COORDINATE" },
        }
      }
      rackIndices.add(rackIndex)
    }

    const formedWords = extractWordsFormed(
      validatedPlacements,
      this.board,
      newTiles
    )
    // Extract the strings for validation against the dictionary
    const words = formedWords.map((fw) => fw.word)

    if (words.length === 0) {
      return {
        success: false,
        error: { valid: false, error: "INVALID_WORD", invalidWords: [] },
      }
    }
    const invalidWords = words.filter((word) => !isValidWithBlank(word))

    if (invalidWords.length > 0) {
      return {
        success: false,
        error: { valid: false, error: "INVALID_WORD", invalidWords },
      }
    }

    for (const { row, col, rackIndex } of validatedPlacements) {
      this.board[row][col] = player.rack[rackIndex]
    }

    const turnScore = calculateTurnScore(
      validatedPlacements,
      this.board,
      newTiles
    )
    player.score += turnScore

    const indices = this.getValidatedRackIndices(placements)
    this.removeTilesFromRack(player, indices)

    const { rack, bag } = refillRack(player.rack, this.bag)
    player.rack = rack
    this.bag = bag

    this.checkGameOver(player)

    if (!this.gameOver) {
      this.advanceTurn()
    }

    return { success: true, turnScore }
  }

  handleReconnect(_playerId: string): HandleReconnectResult {
    const scores = this.getScores()

    if (this.gameOver) {
      return {
        gameOver: true,
        currentTurn: null,
        scores,
        board: this.board,
        winnerIds: this.winnerIds,
      }
    }

    if (!this.players[this.currentTurn ?? ""]?.connected) {
      this.currentTurn = advanceToNextConnectedPlayer(
        this.playerOrder,
        this.players,
        this.currentTurn
      )
    }

    return {
      gameOver: false,
      currentTurn: this.currentTurn,
      scores,
      board: this.board,
      winnerIds: [],
    }
  }

  startGame(): void {
    if (this.gameStarted) return
    this.gameStarted = true

    this.currentTurn = findFirstConnectedPlayer(this.playerOrder, this.players)
    this.bag = shuffleBag(buildBag())

    for (const id in this.players) {
      const player = this.players[id]
      const { drawn, remaining } = drawTiles(this.bag, RACK_SIZE)
      this.bag = remaining
      player.rack = drawn
    }
  }

  private advanceTurn(): void {
    this.currentTurn = advanceToNextConnectedPlayer(
      this.playerOrder,
      this.players,
      this.currentTurn
    )
  }

  private getValidatedRackIndices(placements: unknown): number[] {
    if (!Array.isArray(placements)) return []

    return [
      ...new Set(placements.filter(isPlacement).map((p) => p.rackIndex)),
    ].sort((a, b) => b - a)
  }

  private removeTilesFromRack(player: Player, indices: number[]): void {
    for (const index of indices) {
      if (index >= 0 && index < player.rack.length) {
        player.rack.splice(index, 1)
      }
    }
  }

  private getScores(): Record<string, number> {
    return Object.fromEntries(
      Object.entries(this.players).map(([id, p]) => [id, p.score])
    )
  }

  private checkGameOver(player: Player): void {
    if (this.bag.length !== 0 || player.rack.length !== 0) return
    this.gameOver = true
    const scores = this.getScores()
    const maxScore = Math.max(...Object.values(scores))
    this.winnerIds = Object.entries(scores)
      .filter(([, s]) => s === maxScore)
      .map(([id]) => id)
  }

  skipTurn(): void {
    if (this.gameOver) return
    this.advanceTurn()
  }
}
