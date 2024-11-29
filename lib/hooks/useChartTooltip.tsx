"use client"

import { ReactNode } from "react"

interface TooltipProps {
  active?: boolean
  payload?: any[]
}

export function useChartTooltip(renderContent: (data: any) => ReactNode) {
  return function CustomTooltip({ active, payload }: TooltipProps) {
    if (!active || !payload?.length) return null
    
    return (
      <div className="rounded-lg bg-popover p-2 shadow-md">
        {renderContent(payload[0].payload)}
      </div>
    )
  }
}