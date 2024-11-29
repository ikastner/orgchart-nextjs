"use client"

import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useChartTooltip } from "@/lib/hooks/useChartTooltip"

interface EmployeeTrendProps {
  data: Array<{
    month: string
    count: number
  }>
  trend: {
    value: number
    isUp: boolean
  }
}

export function EmployeeTrend({ data, trend }: EmployeeTrendProps) {
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
      <CardHeader>
        <CardTitle>Évolution des effectifs</CardTitle>
        <CardDescription>6 derniers mois</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month"
                axisLine={false}
              />
              <YAxis 
                axisLine={false}
                width={40}
              />
              <Tooltip content={CustomTooltip} />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      {trend.value > 0 && (
        <CardFooter className="flex items-center gap-2 text-sm">
          <span className="font-medium">
            {trend.isUp ? "Hausse" : "Baisse"} de {trend.value}% ce mois
          </span>
          {trend.isUp ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardFooter>
      )}
    </Card>
  )
}