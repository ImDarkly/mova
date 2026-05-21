export const BOARD_SIZE = 15

export type CellType =
  | "normal"
  | "doubleLetter"
  | "tripleLetter"
  | "doubleWord"
  | "tripleWord"
  | "center"

const CELL_TYPE_LIST: { row: number; col: number; type: CellType }[] = [
  // Triple Word (8 locations)
  { row: 0, col: 0, type: "tripleWord" },
  { row: 0, col: 7, type: "tripleWord" },
  { row: 0, col: 14, type: "tripleWord" },
  { row: 7, col: 0, type: "tripleWord" },
  { row: 7, col: 14, type: "tripleWord" },
  { row: 14, col: 0, type: "tripleWord" },
  { row: 14, col: 7, type: "tripleWord" },
  { row: 14, col: 14, type: "tripleWord" },

  // Triple Letter (12 locations)
  { row: 1, col: 5, type: "tripleLetter" },
  { row: 1, col: 9, type: "tripleLetter" },
  { row: 5, col: 1, type: "tripleLetter" },
  { row: 5, col: 5, type: "tripleLetter" },
  { row: 5, col: 9, type: "tripleLetter" },
  { row: 5, col: 13, type: "tripleLetter" },
  { row: 9, col: 1, type: "tripleLetter" },
  { row: 9, col: 5, type: "tripleLetter" },
  { row: 9, col: 9, type: "tripleLetter" },
  { row: 9, col: 13, type: "tripleLetter" },
  { row: 13, col: 5, type: "tripleLetter" },
  { row: 13, col: 9, type: "tripleLetter" },

  // Double Word (17 locations, including center)
  { row: 1, col: 1, type: "doubleWord" },
  { row: 1, col: 13, type: "doubleWord" },
  { row: 2, col: 2, type: "doubleWord" },
  { row: 2, col: 12, type: "doubleWord" },
  { row: 3, col: 3, type: "doubleWord" },
  { row: 3, col: 11, type: "doubleWord" },
  { row: 4, col: 4, type: "doubleWord" },
  { row: 4, col: 10, type: "doubleWord" },
  { row: 7, col: 7, type: "center" },
  { row: 10, col: 4, type: "doubleWord" },
  { row: 10, col: 10, type: "doubleWord" },
  { row: 11, col: 3, type: "doubleWord" },
  { row: 11, col: 11, type: "doubleWord" },
  { row: 12, col: 2, type: "doubleWord" },
  { row: 12, col: 12, type: "doubleWord" },
  { row: 13, col: 1, type: "doubleWord" },
  { row: 13, col: 13, type: "doubleWord" },

  // Double Letter (24 locations)
  { row: 0, col: 3, type: "doubleLetter" },
  { row: 0, col: 11, type: "doubleLetter" },
  { row: 2, col: 6, type: "doubleLetter" },
  { row: 2, col: 8, type: "doubleLetter" },
  { row: 3, col: 0, type: "doubleLetter" },
  { row: 3, col: 7, type: "doubleLetter" },
  { row: 3, col: 14, type: "doubleLetter" },
  { row: 6, col: 2, type: "doubleLetter" },
  { row: 6, col: 6, type: "doubleLetter" },
  { row: 6, col: 8, type: "doubleLetter" },
  { row: 6, col: 12, type: "doubleLetter" },
  { row: 7, col: 3, type: "doubleLetter" },
  { row: 7, col: 11, type: "doubleLetter" },
  { row: 8, col: 2, type: "doubleLetter" },
  { row: 8, col: 6, type: "doubleLetter" },
  { row: 8, col: 8, type: "doubleLetter" },
  { row: 8, col: 12, type: "doubleLetter" },
  { row: 11, col: 0, type: "doubleLetter" },
  { row: 11, col: 7, type: "doubleLetter" },
  { row: 11, col: 14, type: "doubleLetter" },
  { row: 12, col: 6, type: "doubleLetter" },
  { row: 12, col: 8, type: "doubleLetter" },
  { row: 14, col: 3, type: "doubleLetter" },
  { row: 14, col: 11, type: "doubleLetter" },
]

const CELL_TYPE_MAP = new Map<string, CellType>(
  CELL_TYPE_LIST.map(({ row, col, type }) => [`${row},${col}`, type])
)

export function getCellType(row: number, col: number): CellType {
  return CELL_TYPE_MAP.get(`${row},${col}`) ?? "normal"
}

export const CELL_VARIANTS = {
  normal: "bg-background ",
  doubleLetter: "bg-border text-muted-foreground/80",
  tripleLetter: "bg-muted text-muted-foreground",
  doubleWord: "bg-primary/5 text-primary/60",
  tripleWord: "bg-primary/10 text-primary/70",
  center: "bg-primary/10 text-primary/70",
} as const satisfies Record<CellType, string>

export const CELL_LABELS: Record<CellType, string> = {
  normal: "",
  doubleLetter: "DL",
  tripleLetter: "TL",
  doubleWord: "DW",
  tripleWord: "TW",
  center: "★",
}

export type CellVariant = (typeof CELL_VARIANTS)[CellType]
