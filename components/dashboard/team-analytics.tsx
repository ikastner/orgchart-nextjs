"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrgChartData } from "@/lib/types"
import { TreemapChart } from "@/components/charts/treemap-chart"

export function TeamAnalytics() {
  const [hierarchyData, setHierarchyData] = useState<any[]>([])

  useEffect(() => {
    const savedCharts = localStorage.getItem('orgCharts')
    if (savedCharts) {
      const charts = JSON.parse(savedCharts)
      if (charts.length > 0) {
        const latestChart = charts[0].data
        setHierarchyData([processNode(latestChart)])
      }
    }
  }, [])

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Structure hiérarchique</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          {hierarchyData.length > 0 ? (
            <TreemapChart data={hierarchyData} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function processNode(node: OrgChartData) {
  const result = {
    name: `${node.name}\n${node.title}`,
    size: 1,
    children: node.children?.map(processNode) || []
  }

  return result
}