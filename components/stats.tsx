"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Users, Download } from "lucide-react"
import { OrgChartData, ChartStorage } from "@/lib/types"

export function Stats() {
  const [stats, setStats] = useState({
    totalCharts: 0,
    totalEmployees: 0,
    totalDownloads: 0
  })

  useEffect(() => {
    const savedCharts = localStorage.getItem('orgCharts')
    const charts: ChartStorage[] = savedCharts ? JSON.parse(savedCharts) : []
    const downloads = parseInt(localStorage.getItem('pdfDownloads') || '0')

    const countEmployees = (data: OrgChartData): number => {
      let count = 1
      if (data.children) {
        count += data.children.reduce((acc, child) => acc + countEmployees(child), 0)
      }
      return count
    }

    const totalEmployees = charts.reduce((acc, chart) => 
      acc + countEmployees(chart.data), 0)

    setStats({
      totalCharts: charts.length,
      totalEmployees,
      totalDownloads: downloads
    })
  }, [])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des organigrammes</CardTitle>
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCharts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des employés</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEmployees}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Téléchargements PDF</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDownloads}</div>
        </CardContent>
      </Card>
    </>
  )
}