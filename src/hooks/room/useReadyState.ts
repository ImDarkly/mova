import { useState } from "react"

export function useReadyState(send: (data: object) => void) {
  const [ready, setReady] = useState(false)

  const toggle = () => {
    const next = !ready
    setReady(next)
    send({ type: next ? "READY" : "UNREADY" })
  }

  return { ready, toggle }
}
