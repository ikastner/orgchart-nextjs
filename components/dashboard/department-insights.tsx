"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrgChartData } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

interface DepartmentStat {
  name: string
  count: number
  percentage: number
  growth: number
}

export function DepartmentInsights() {
  const [stats, setStats] = useState<DepartmentStat[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)

  useEffect(() => {
    const savedCharts = localStorage.getItem('orgCharts')
    if (savedCharts) {
      const charts = JSON.parse(savedCharts)
      if (charts.length > 0) {
        const latestChart = charts[0].data
        const previousChart = charts[1]?.data

        const departments = new Map<string, number>()
        const previousDepartments = new Map<string, number>()

        function countDepartments(node: OrgChartData, counts: Map<string, number>) {
          counts.set(node.department, (counts.get(node.department) || 0) + 1)
          node.children?.forEach(child => countDepartments(child, counts))
        }

        // Compter les départements actuels
        countDepartments(latestChart, departments)
        if (previousChart) {
          countDepartments(previousChart, previousDepartments)
        }

        const total = Array.from(departments.values()).reduce((a, b) => a + b, 0)
        setTotalEmployees(total)

        const departmentStats: DepartmentStat[] = Array.from(departments.entries())
          .map(([name, count]) => {
            const previousCount = previousDepartments.get(name) || 0
            const growth = previousCount ? ((count - previousCount) / previousCount) * 100 : 0
            
            return {
              name,
              count,
              percentage: (count / total) * 100,
              growth
            }
          })
          .sort((a, b) => b.count - a.count)

        setStats(departmentStats)
      }
    }
  }, [])

  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Répartition par département</h3>
        <p className="text-sm text-muted-foreground">
          Total: {totalEmployees} employés
        </p>
      </div>

      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{stat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.count} employés
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {stat.percentage.toFixed(1)}%
                </p>
                <p className={`text-xs ${stat.growth > 0 ? 'text-green-500' : stat.growth < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {stat.growth > 0 ? '+' : ''}{stat.growth.toFixed(1)}%
                </p>
              </div>
            </div>
            <Progress value={stat.percentage} className="h-2" />
          </div>
        ))}

        {stats.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Aucune donnée disponible
          </p>
        )}
      </div>
    </CardContent>
  )
}