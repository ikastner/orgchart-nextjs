"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function GridBackground() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
  }

  return (
    <div 
      className={`absolute inset-0 bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] ${
        resolvedTheme === "dark" ? 'bg-grid-white/[0.02]' : 'bg-grid-black/[0.02]'
      }`}
    />
  )
}