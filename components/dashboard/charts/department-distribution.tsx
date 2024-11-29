"use client"

import { CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface DepartmentStat {
  name: string
  count: number
  percentage: number
  growth: number
}

interface DepartmentDistributionProps {
  stats: DepartmentStat[]
  totalEmployees: number
}

export function DepartmentDistribution({ stats, totalEmployees }: DepartmentDistributionProps) {
  return (
    <CardContent>
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Répartition</h3>
          <p className="text-sm text-muted-foreground">
            Total: {totalEmployees} employés
          </p>
        </div>

        <div className="space-y-8">
          {stats.map((stat) => (
            <div key={stat.name} className="space-y-3">
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
      </div>
    </CardContent>
  )
}