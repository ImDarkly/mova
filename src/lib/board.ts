export const BOARD_SIZE = 15

export type CellType =
  | "normal"
  | "doubleLetter"
  | "tripleLetter"
  | "doubleWord"
  | "tripleWord"
  | "center"

export const CELL_TYPES: Record<number, CellType> = {
  // Triple word
  0: "tripleWord",
  7: "tripleWord",
  14: "tripleWord",
  105: "tripleWord",
  119: "tripleWord",
  210: "tripleWord",
  217: "tripleWord",
  224: "tripleWord",

  // Double word
  16: "doubleWord",
  28: "doubleWord",
  32: "doubleWord",
  42: "doubleWord",
  48: "doubleWord",
  56: "doubleWord",
  64: "doubleWord",
  70: "doubleWord",
  154: "doubleWord",
  160: "doubleWord",
  168: "doubleWord",
  176: "doubleWord",
  182: "doubleWord",
  192: "doubleWord",
  196: "doubleWord",
  208: "doubleWord",

  // Triple letter
  20: "tripleLetter",
  24: "tripleLetter",
  76: "tripleLetter",
  80: "tripleLetter",
  84: "tripleLetter",
  88: "tripleLetter",
  136: "tripleLetter",
  140: "tripleLetter",
  144: "tripleLetter",
  148: "tripleLetter",
  200: "tripleLetter",
  204: "tripleLetter",

  // Double letter
  3: "doubleLetter",
  11: "doubleLetter",
  36: "doubleLetter",
  38: "doubleLetter",
  45: "doubleLetter",
  52: "doubleLetter",
  59: "doubleLetter",
  92: "doubleLetter",
  96: "doubleLetter",
  98: "doubleLetter",
  102: "doubleLetter",
  108: "doubleLetter",
  116: "doubleLetter",
  126: "doubleLetter",
  128: "doubleLetter",
  132: "doubleLetter",
  165: "doubleLetter",
  172: "doubleLetter",
  179: "doubleLetter",
  186: "doubleLetter",
  188: "doubleLetter",
  213: "doubleLetter",
  221: "doubleLetter",

  // Center
  112: "center",
}

export function getCellType(row: number, col: number): CellType {
  return CELL_TYPES[row * BOARD_SIZE + col] ?? "normal"
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
