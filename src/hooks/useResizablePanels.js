
import { useCallback, useRef, useState } from "react"

const DEFAULT_WIDTH = 25
const MIN_WIDTH = 20
const MAX_WIDTH = 50

export default function useResizablePanels() {
  const [scannerWidth, setScannerWidth] = useState(DEFAULT_WIDTH)
  const containerRef = useRef(null)
  const draggingRef = useRef(false)

  const resize = useCallback((clientX) => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    if (!rect.width) return

    const percentage = ((clientX - rect.left) / rect.width) * 100

    setScannerWidth(
      Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, percentage))
    )
  }, [])

  const onPointerDown = useCallback((event) => {
    event.preventDefault()
    draggingRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const onPointerMove = useCallback((event) => {
    if (!draggingRef.current) return
    resize(event.clientX)
  }, [resize])

  const onPointerUp = useCallback(() => {
    draggingRef.current = false
  }, [])

  const onKeyDown = useCallback((event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      setScannerWidth((width) => Math.max(MIN_WIDTH, width - 2))
    }

    if (event.key === "ArrowRight") {
      event.preventDefault()
      setScannerWidth((width) => Math.min(MAX_WIDTH, width + 2))
    }

    if (event.key === "Home") {
      setScannerWidth(MIN_WIDTH)
    }

    if (event.key === "End") {
      setScannerWidth(MAX_WIDTH)
    }
  }, [])

  return {
    scannerWidth,
    containerRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
  }
}
