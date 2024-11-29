"use client"

import { CategoricalChartProps } from "recharts"

export const chartDefaults = {
  containerProps: {
    className: "h-[300px]",
  },
  responsiveProps: {
    width: "100%",
    height: "100%",
    debounce: 50,
  } as const,
  gridProps: {
    strokeDasharray: "3 3",
    vertical: false,
    stroke: "hsl(var(--border))",
  },
} as const

export const chartCommonProps: Partial<CategoricalChartProps> = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  barGap: 4,
  reverseStackOrder: false,
}