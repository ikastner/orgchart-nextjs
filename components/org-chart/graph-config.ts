"use client"

import { useTheme } from "next-themes"
import type { Graph } from "@antv/g6"
import { nodeStyles, edgeStyles } from "./styles"

export function useGraphConfig() {
  const { theme } = useTheme()

  const getNodeConfig = () => ({
    type: 'custom-node',
    size: [nodeStyles.container.width, nodeStyles.container.height],
    style: {
      fill: 'var(--card)',
      stroke: 'var(--border)',
      radius: nodeStyles.container.radius,
      shadowColor: 'rgba(0,0,0,0.1)',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
    },
  })

  const getEdgeConfig = (G6: typeof Graph) => ({
    type: 'cubic-horizontal',
    style: {
      stroke: 'var(--border)',
      lineWidth: edgeStyles.lineWidth,
      endArrow: {
        path: G6.Arrow.triangle(
          edgeStyles.arrowSize.width,
          edgeStyles.arrowSize.height,
          edgeStyles.arrowSize.offset
        ),
        fill: 'var(--border)',
      },
    },
  })

  return {
    getNodeConfig,
    getEdgeConfig,
  }
}

export const layoutConfig = {
  type: 'compactBox',
  direction: 'LR',
  getId: (d: any) => d.id,
  getHeight: () => nodeStyles.container.height,
  getWidth: () => nodeStyles.container.width,
  getVGap: () => 40,
  getHGap: () => 100,
}