import { useState } from "react"

type ReadyMessage = { type: "READY" } | { type: "UNREADY" }

export function useReadyState(send: (data: ReadyMessage) => boolean) {
  const [ready, setReady] = useState(false)

  const toggle = () => {
    const next = !ready
    const sent = send({ type: next ? "READY" : "UNREADY" })
    if (sent) setReady(next)
  }

  return { ready, toggle }
}
