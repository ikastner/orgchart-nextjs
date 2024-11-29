"use client"

import { useTheme } from "next-themes"

export function useChartConfig() {
  const { theme } = useTheme()

  const getNodeConfig = () => ({
    type: 'custom-node',
    size: [240, 120],
    style: {
      fill: 'var(--card)',
      stroke: 'var(--border)',
      radius: 8,
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
    },
  })

  const getEdgeConfig = () => ({
    type: 'cubic-horizontal',
    style: {
      stroke: 'var(--border)',
      lineWidth: 1,
      endArrow: {
        path: 'M 0,0 L 8,4 L 8,-4 Z',
        fill: 'var(--border)',
      },
    },
  })

  return {
    getNodeConfig,
    getEdgeConfig,
  }
}