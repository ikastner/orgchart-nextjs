"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Stats } from "@/components/stats"
import { EmployeeCount } from "@/components/dashboard/charts/employee-count"
import { DepartmentDistribution } from "@/components/dashboard/charts/department-distribution"
import { OrgChartData } from "@/lib/types"

interface DepartmentStat {
  name: string
  count: number
  percentage: number
  growth: number
}

export function Overview() {
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([])
  const [employeeData, setEmployeeData] = useState<{ month: string; count: number }[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [trend, setTrend] = useState({ value: 0, isUp: true })

  useEffect(() => {
    const savedCharts = localStorage.getItem('orgCharts')
    if (savedCharts) {
      const charts = JSON.parse(savedCharts)
      
      if (charts.length > 0) {
        // Process department data from latest chart
        const latestChart = charts[0].data
        const deptCounts = new Map<string, number>()
        
        function countDepartments(node: OrgChartData) {
          deptCounts.set(node.department, (deptCounts.get(node.department) || 0) + 1)
          node.children?.forEach(countDepartments)
        }
        
        countDepartments(latestChart)
        const total = Array.from(deptCounts.values()).reduce((a, b) => a + b, 0)
        setTotalEmployees(total)

        const deptStats = Array.from(deptCounts.entries())
          .map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / total) * 100),
            growth: 0
          }))
          .sort((a, b) => b.count - a.count)

        setDepartmentStats(deptStats)

        // Process employee trend data
        const monthlyData = charts
          .map((chart: any) => ({
            date: new Date(chart.timestamp),
            count: countEmployees(chart.data)
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(item => ({
            month: item.date.toLocaleDateString('fr-FR', {
              month: 'short',
              year: '2-digit'
            }),
            count: item.count
          }))

        // Calculate trend
        if (monthlyData.length >= 2) {
          const lastTwo = monthlyData.slice(-2)
          const diff = lastTwo[1].count - lastTwo[0].count
          const percentage = Math.abs((diff / lastTwo[0].count) * 100)
          setTrend({
            value: Number(percentage.toFixed(1)),
            isUp: diff >= 0
          })
        }

        setEmployeeData(monthlyData.slice(-6))
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Stats />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <EmployeeCount 
          data={employeeData}
          trend={trend}
        />
        <Card>
          <DepartmentDistribution 
            stats={departmentStats}
            totalEmployees={totalEmployees}
          />
        </Card>
      </div>
    </div>
  )
}

function countEmployees(data: OrgChartData): number {
  let count = 1
  if (data.children) {
    count += data.children.reduce((acc, child) => acc + countEmployees(child), 0)
  }
  return count
}