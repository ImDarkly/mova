export const ROOM_CODE_LENGTH = 6

export function generateRoomId() {
  return Math.random()
    .toString(36)
    .padEnd(2 + ROOM_CODE_LENGTH, "0")
    .substring(2, 2 + ROOM_CODE_LENGTH)
    .toUpperCase()
}
