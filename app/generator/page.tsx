"use client"

import { useState, useEffect } from "react"
import { FileUploader } from "@/components/file-uploader"
import { OrgChartViewer } from "@/components/org-chart-viewer"
import { CSVCreator } from "@/components/csv-creator"
import { OrgChartData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GeneratorPage() {
  const [chartData, setChartData] = useState<OrgChartData | null>(null)

  useEffect(() => {
    // Vérifier s'il y a un graphique en cours à afficher
    const currentChart = localStorage.getItem('currentChart')
    if (currentChart) {
      setChartData(JSON.parse(currentChart))
      localStorage.removeItem('currentChart')
    }
  }, [])

  const handleDataLoaded = (data: OrgChartData) => {
    setChartData(data)
    
    // Sauvegarder dans le localStorage
    const savedCharts = localStorage.getItem('orgCharts')
    const charts = savedCharts ? JSON.parse(savedCharts) : []
    
    // Ajouter le nouveau graphique avec un timestamp
    charts.unshift({
      data,
      timestamp: Date.now()
    })
    
    // Garder seulement les 10 derniers graphiques
    const recentCharts = charts.slice(0, 10)
    localStorage.setItem('orgCharts', JSON.stringify(recentCharts))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Importer CSV</TabsTrigger>
          <TabsTrigger value="create">Créer CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Générateur d'Organigramme</CardTitle>
              <CardDescription>
                Importez un fichier CSV pour générer votre organigramme. Le fichier doit contenir les colonnes pour l'ID de l'employé, le nom, le titre et l'ID du manager.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!chartData ? (
                <FileUploader onDataLoaded={handleDataLoaded} />
              ) : (
                <OrgChartViewer data={chartData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <CSVCreator />
        </TabsContent>
      </Tabs>
    </div>
  )
}