"use client"

import { ResponsiveContainer, Treemap, Tooltip } from "recharts"
import { useChartTooltip } from "@/lib/hooks/useChartTooltip"

interface TreemapChartProps {
  data: any[]
}

export function TreemapChart({ data }: TreemapChartProps) {
  const CustomTooltip = useChartTooltip((data) => {
    const name = data.name.split('\n')
    return (
      <>
        <p className="font-medium">{name[0]}</p>
        <p className="text-sm text-muted-foreground">{name[1]}</p>
        <p className="text-sm text-muted-foreground">
          {data.children ? `${data.children.length} subordonnés` : 'Aucun subordonné'}
        </p>
      </>
    )
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={data}
        dataKey="size"
        nameKey="name"
        stroke="hsl(var(--border))"
        fill="hsl(var(--primary))"
      >
        <Tooltip content={CustomTooltip} />
      </Treemap>
    </ResponsiveContainer>
  )
}