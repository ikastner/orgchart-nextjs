"use client"

import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChartTooltip } from "@/lib/hooks/useChartTooltip"

interface DepartmentChartProps {
  data: Array<{
    department: string
    count: number
    percentage: number
  }>
  totalEmployees: number
}

export function DepartmentChart({ data, totalEmployees }: DepartmentChartProps) {
  const CustomTooltip = useChartTooltip((data) => (
    <>
      <p className="font-medium">{data.department}</p>
      <p className="text-sm text-muted-foreground">
        {data.count} employés ({data.percentage}%)
      </p>
    </>
  ))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employés par département</CardTitle>
        <CardDescription>Répartition actuelle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                scale="auto"
                allowDecimals={false}
              />
              <YAxis 
                type="category" 
                dataKey="department"
                width={100}
                axisLine={false}
                tickLine={false}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={CustomTooltip} />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground text-center">
            Total: {totalEmployees} employés
          </p>
        </div>
      </CardContent>
    </Card>
  )
}