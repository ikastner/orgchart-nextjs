"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useChartTooltip } from "@/lib/hooks/useChartTooltip"
import { chartDefaults, chartCommonProps } from "@/lib/chart-config"
import { TrendingUp, TrendingDown } from "lucide-react"

interface EmployeeCountProps {
  data: Array<{
    month: string
    count: number
  }>
  trend: {
    value: number
    isUp: boolean
  }
}

export function EmployeeCount({ data, trend }: EmployeeCountProps) {
  const CustomTooltip = useChartTooltip((data) => (
    <>
      <p className="font-medium">{data.month}</p>
      <p className="text-sm text-muted-foreground">
        {data.count} employés
      </p>
    </>
  ))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Évolution des effectifs</CardTitle>
        {trend.value > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {trend.isUp ? "+" : "-"}{trend.value}%
            </span>
            {trend.isUp ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div {...chartDefaults.containerProps}>
          <ResponsiveContainer {...chartDefaults.responsiveProps}>
            <BarChart data={data} {...chartCommonProps}>
              <CartesianGrid {...chartDefaults.gridProps} />
              <XAxis 
                dataKey="month"
                axisLine={false}
                tickLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                scale="auto"
                allowDecimals={false}
                allowDuplicatedCategory={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                scale="auto"
                allowDecimals={false}
                width={40}
              />
              <Tooltip 
                content={CustomTooltip}
                cursor={{ fill: 'hsl(var(--muted)/0.1)' }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                minPointSize={2}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}