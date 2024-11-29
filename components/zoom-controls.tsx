"use client"

import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface ZoomControlsProps {
  zoom: number
  onZoomChange: (value: number) => void
  onReset: () => void
  className?: string
}

export function ZoomControls({ zoom, onZoomChange, onReset, className }: ZoomControlsProps) {
  const ZOOM_STEP = 0.1
  const MIN_ZOOM = 0.1
  const MAX_ZOOM = 5

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onZoomChange(Math.max(MIN_ZOOM, zoom - ZOOM_STEP))}
        disabled={zoom <= MIN_ZOOM}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="w-[200px]">
        <Slider
          value={[zoom]}
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={ZOOM_STEP}
          onValueChange={([value]) => onZoomChange(value)}
        />
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onZoomChange(Math.min(MAX_ZOOM, zoom + ZOOM_STEP))}
        disabled={zoom >= MAX_ZOOM}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        disabled={zoom === 1}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      <span className="text-sm text-muted-foreground ml-2">
        {Math.round(zoom * 100)}%
      </span>
    </div>
  )
}