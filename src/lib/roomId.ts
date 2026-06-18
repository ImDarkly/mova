export const ROOM_CODE_LENGTH = 6
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ34679"

export function generateRoomId() {
  let result = ""
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}
