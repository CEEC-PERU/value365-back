"use client"

import type React from "react"

interface CanvasConnectorProps {
  fromY: number
  toY: number
  x: number
}

export const CanvasConnector: React.FC<CanvasConnectorProps> = ({ fromY, toY, x }) => {
  const height = Math.abs(toY - fromY)
  const startY = Math.min(fromY, toY)

  return (
    <svg
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${startY}px`,
        width: "2px",
        height: `${height}px`,
        pointerEvents: "none",
      }}
    >
      <line x1="0" y1="0" x2="0" y2={height} stroke="#60a5fa" strokeWidth="2" />
    </svg>
  )
}

export default CanvasConnector
