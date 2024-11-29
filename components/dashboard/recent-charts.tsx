"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generatePDF } from "@/lib/pdf-generator"
import { OrgChartData, ChartStorage } from "@/lib/types"

interface RecentChartsProps {
  limit?: number
}

export function RecentCharts({ limit }: RecentChartsProps) {
  const [charts, setCharts] = useState<ChartStorage[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const savedCharts = localStorage.getItem('orgCharts')
    if (savedCharts) {
      try {
        const parsed = JSON.parse(savedCharts)
        setCharts(limit ? parsed.slice(0, limit) : parsed)
      } catch (error) {
        console.error('Erreur lors du chargement des organigrammes:', error)
      }
    }
  }, [limit])

  const handleDelete = (index: number) => {
    const newCharts = [...charts]
    newCharts.splice(index, 1)
    setCharts(newCharts)
    localStorage.setItem('orgCharts', JSON.stringify(newCharts))
    toast({
      title: "Organigramme supprimé",
      description: "L'organigramme a été supprimé avec succès",
    })
  }

  const handleView = (data: OrgChartData) => {
    localStorage.setItem('currentChart', JSON.stringify(data))
    router.push('/generator')
  }

  const handleDownload = (data: OrgChartData) => {
    try {
      const container = document.createElement('div')
      container.className = 'org-chart-container'
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      document.body.appendChild(container)

      generatePDF(container)
      document.body.removeChild(container)

      const downloads = parseInt(localStorage.getItem('pdfDownloads') || '0')
      localStorage.setItem('pdfDownloads', (downloads + 1).toString())

      toast({
        title: "PDF généré",
        description: "L'organigramme a été exporté en PDF avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive",
      })
    }
  }

  if (charts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-muted-foreground">
          <p>Aucun organigramme récent.</p>
          <p className="mt-2">Commencez par en créer un dans le générateur.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organigrammes récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {charts.map((chart, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{chart.data.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {chart.data.title} - {chart.data.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDownload(chart.data)}
                      title="Télécharger en PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleView(chart.data)}
                      title="Visualiser"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(index)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(chart.timestamp).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}