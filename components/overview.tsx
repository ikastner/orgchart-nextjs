"use client"

import { useEffect, useState } from "react"
import { ChartStorage, OrgChartData } from "@/lib/types"
import { DepartmentChart } from "@/components/charts/department-chart"
import { EmployeeTrend } from "@/components/charts/employee-trend"

function countEmployees(data: OrgChartData): number {
  let count = 1
  if (data.children) {
    count += data.children.reduce((acc, child) => acc + countEmployees(child), 0)
  }
  return count
}

function getDepartmentCounts(data: OrgChartData, counts: Map<string, number> = new Map()): Map<string, number> {
  counts.set(data.department, (counts.get(data.department) || 0) + 1)
  if (data.children) {
    data.children.forEach(child => getDepartmentCounts(child, counts))
  }
  return counts
}

export function Overview() {
  const [departmentData, setDepartmentData] = useState<any[]>([])
  const [employeeData, setEmployeeData] = useState<any[]>([])
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [trend, setTrend] = useState({ value: 0, isUp: true })

  useEffect(() => {
    const savedCharts = localStorage.getItem('orgCharts')
    if (savedCharts) {
      const charts: ChartStorage[] = JSON.parse(savedCharts)
      
      if (charts.length > 0) {
        // Get department data from latest chart
        const latestChart = charts[0]
        const deptCounts = getDepartmentCounts(latestChart.data)
        const total = countEmployees(latestChart.data)
        
        setTotalEmployees(total)

        const deptChartData = Array.from(deptCounts.entries())
          .map(([department, count]) => ({
            department,
            count,
            percentage: Math.round((count / total) * 100)
          }))
          .sort((a, b) => b.count - a.count)

        setDepartmentData(deptChartData)

        // Process employee count evolution data
        const monthlyData = charts
          .map(chart => ({
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
    <div className="grid gap-4 md:grid-cols-2">
      <DepartmentChart 
        data={departmentData}
        totalEmployees={totalEmployees}
      />
      <EmployeeTrend 
        data={employeeData}
        trend={trend}
      />
    </div>
  )
}