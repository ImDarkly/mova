import assert from "node:assert/strict"
import { after, before, test } from "node:test"
import { chromium } from "playwright"
import { createServer } from "vite"
import { createServer as createPortReservation } from "node:net"

let server
let browser
let origin
const myId = "review-emily"
const friendId = "review-james"
const players = [myId, friendId].map((id, index) => ({
  id,
  name: index ? "James" : "Emily",
  ready: false,
  connected: true,
  score: 0,
}))
const tiles = [..."SOABCDE"].map((letter) => ({ letter, points: 1 }))

before(
  async () => {
    const reservation = createPortReservation()
    await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve))
    const port = reservation.address().port
    await new Promise((resolve) => reservation.close(resolve))
    server = await createServer({
      cacheDir: "node_modules/.vite-review-tests",
      server: { host: "127.0.0.1", port, strictPort: true },
    })
    await server.listen()
    origin = `http://127.0.0.1:${server.httpServer.address().port}`
    browser = await chromium.launch({
      channel: process.platform === "win32" ? "chrome" : undefined,
    })
  },
  { timeout: 60000 }
)
after(async () => {
  await browser?.close()
  await server?.close()
})

async function openGame(
  t,
  currentTurn = myId,
  viewport = { width: 375, height: 812 }
) {
  const context = await browser.newContext({
    viewport,
  })
  t.after(() => context.close())
  await context.addInitScript((id) => {
    localStorage.setItem("clientId", id)
    localStorage.setItem("playerName", "Emily")
  }, myId)
  let socket
  await context.routeWebSocket("**/parties/**", (ws) => {
    socket = ws
    for (const message of [
      { type: "ROOM_STATE", players },
      { type: "RACK_STATE", tiles },
      { type: "GAME_START", currentTurn, scores: {} },
      { type: "BOARD_STATE", board: {} },
    ])
      ws.send(JSON.stringify(message))
  })
  const page = await context.newPage()
  await page.goto(`${origin}/game/ABC123`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  })
  await page
    .getByRole("button", { name: "Tile S, 1 point", exact: true })
    .waitFor({ timeout: 60000 })
  const emit = async (message) => {
    socket.send(JSON.stringify(message))
    await page.waitForTimeout(100)
  }
  const place = async () => {
    await page
      .getByRole("button", { name: "Tile S, 1 point", exact: true })
      .click()
    await page
      .getByRole("button", {
        name: "Row 8, column 8, centre star",
        exact: true,
      })
      .click()
    await page
      .getByRole("button", { name: "Tile O, 1 point", exact: true })
      .click()
    await page
      .getByRole("button", {
        name: "Row 8, column 9, empty square",
        exact: true,
      })
      .click()
  }
  return { page, emit, place }
}

test("accepted word clears submission and old placements when the same player plays again", async (t) => {
  const { page, emit, place } = await openGame(t)
  await place()
  await page.getByRole("button", { name: "Play word", exact: true }).click()
  assert.ok(
    await page
      .getByRole("button", { name: "Playing\u2026", exact: true })
      .isDisabled()
  )
  // Disconnect/reconnect broadcasts can repeat the same turn before the submit succeeds.
  await emit({ type: "TURN_CHANGE", currentTurn: myId, scores: {} })
  assert.equal(
    await page.locator(".pending").count(),
    2,
    "unacknowledged draft must be preserved"
  )
  assert.ok(
    await page
      .getByRole("button", { name: "Playing\u2026", exact: true })
      .isDisabled()
  )
  await emit({
    type: "RACK_STATE",
    tiles: [..."RSTUVWX"].map((letter) => ({ letter, points: 1 })),
  })
  await emit({
    type: "BOARD_STATE",
    board: { "7,7": tiles[0], "7,8": tiles[1] },
  })
  await emit({ type: "TURN_CHANGE", currentTurn: myId, scores: { [myId]: 2 } })
  assert.equal(
    await page.locator(".pending").count(),
    0,
    "accepted placements must not overlay replacement rack tiles"
  )
  assert.equal(
    await page
      .getByRole("button", { name: "Playing\u2026", exact: true })
      .count(),
    0,
    "accepted submit must leave checking state"
  )
  assert.ok(
    await page
      .getByRole("button", { name: "Tile R, 1 point", exact: true })
      .isEnabled()
  )
  await page.getByRole("button", { name: "More", exact: true }).click()
  assert.ok(
    await page
      .getByRole("menuitem", { name: "Skip turn", exact: true })
      .isEnabled()
  )
})

test("rejected words retain their placements and permit correction and resubmission", async (t) => {
  const { page, emit, place } = await openGame(t)
  await place()
  await page.getByRole("button", { name: "Play word", exact: true }).click()
  await emit({
    type: "SUBMIT_ERROR",
    valid: false,
    error: "INVALID_WORD",
    invalidWords: ["SO"],
  })
  assert.equal(await page.locator(".pending").count(), 2)
  assert.ok(
    await page
      .getByRole("button", { name: "Play word", exact: true })
      .isEnabled()
  )
  await page
    .getByRole("button", { name: "Return tiles to rack", exact: true })
    .click()
  assert.equal(await page.locator(".pending").count(), 0)
})

test("leave confirmation survives an opponent finishing a turn", async (t) => {
  const { page, emit } = await openGame(t, friendId)
  await page.getByRole("button", { name: "More", exact: true }).click()
  await page
    .getByRole("menuitem", { name: "Leave game\u2026", exact: true })
    .click()
  await page.getByRole("alertdialog").waitFor()
  await emit({
    type: "TURN_CHANGE",
    currentTurn: myId,
    scores: { [friendId]: 2 },
  })
  assert.ok(
    await page.getByRole("alertdialog").isVisible(),
    "turn changes must not dismiss leave confirmation"
  )
  await page.getByRole("button", { name: "Stay", exact: true }).click()
  await page.getByRole("alertdialog").waitFor({ state: "detached" })
})

test("short-screen Home keeps the join controls reachable by scrolling", async (t) => {
  const context = await browser.newContext({
    viewport: { width: 667, height: 375 },
  })
  t.after(() => context.close())
  const page = await context.newPage()
  await page.goto(origin)
  const shell = page.locator(".page-shell")
  await shell.waitFor()
  await shell.hover()
  await page.mouse.wheel(0, 1000)
  await page.waitForTimeout(150)
  const state = await shell.evaluate((el) => ({
    top: el.scrollTop,
    overflow: getComputedStyle(el).overflowY,
  }))
  assert.ok(
    ["auto", "scroll"].includes(state.overflow),
    "entry shell must allow user scrolling"
  )
  assert.ok(state.top > 0, "wheel scroll must reveal lower entry controls")
  const join = await page
    .getByRole("button", { name: "Join room", exact: true })
    .boundingBox()
  assert.ok(
    join.y >= 0 && join.y + join.height <= 375,
    "Join room must be inside the visible scrolled viewport"
  )
})

test("room copy button includes its visible room label in its accessible name", async (t) => {
  const { page } = await openGame(t)
  const room = page
    .locator("button.room-chip")
    .filter({ hasText: "Room ABC123" })
  assert.match(await room.getAttribute("aria-label"), /Room ABC123/)
})

test("selected board has one tab stop and supports arrow-key placement and return", async (t) => {
  const { page } = await openGame(t)
  await page
    .getByRole("button", { name: "Tile S, 1 point", exact: true })
    .focus()
  await page.keyboard.press("Enter")
  assert.equal(
    await page.locator('.board-cell[tabindex="0"]').count(),
    1,
    "the board should not add 225 tab stops"
  )
  await page.keyboard.press("Shift+Tab")
  assert.match(
    await page.locator(":focus").getAttribute("aria-label"),
    /Row 8, column 8/
  )
  await page.keyboard.press("ArrowRight")
  assert.match(
    await page.locator(":focus").getAttribute("aria-label"),
    /Row 8, column 9/
  )
  await page.keyboard.press("Enter")
  assert.equal(await page.locator(".pending").count(), 1)
  await page
    .getByRole("button", {
      name: "Return tile S, 1 point to rack",
      exact: true,
    })
    .focus()
  await page.keyboard.press("Enter")
  assert.equal(await page.locator(".pending").count(), 0)
})

test("desktop leave confirmation survives a fresh rack snapshot", async (t) => {
  const { page, emit } = await openGame(t, myId, { width: 1440, height: 900 })
  await page.getByRole("button", { name: "Leave", exact: true }).click()
  await page.getByRole("alertdialog").waitFor()
  await emit({ type: "RACK_STATE", tiles })
  assert.ok(await page.getByRole("alertdialog").isVisible())
  await page.getByRole("button", { name: "Stay", exact: true }).click()
  await page.getByRole("alertdialog").waitFor({ state: "detached" })
})
