"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Download, Eye, Users } from "lucide-react"

interface Activity {
  id: string
  type: "create" | "view" | "download" | "update"
  timestamp: number
  details: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Récupérer l'historique des activités
    const savedCharts = localStorage.getItem('orgCharts')
    const charts = savedCharts ? JSON.parse(savedCharts) : []
    const downloads = parseInt(localStorage.getItem('pdfDownloads') || '0')

    const newActivities: Activity[] = []

    // Ajouter les activités de création
    charts.forEach((chart: any) => {
      newActivities.push({
        id: `create-${chart.timestamp}`,
        type: "create",
        timestamp: chart.timestamp,
        details: `Création d'un organigramme pour ${chart.data.name}`
      })
    })

    // Ajouter les téléchargements
    for (let i = 0; i < downloads; i++) {
      newActivities.push({
        id: `download-${i}`,
        type: "download",
        timestamp: Date.now() - (i * 86400000), // Simuler des dates différentes
        details: "Téléchargement d'un organigramme en PDF"
      })
    }

    // Trier par date décroissante
    newActivities.sort((a, b) => b.timestamp - a.timestamp)
    setActivities(newActivities)
  }, [])

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "create":
        return <FileSpreadsheet className="h-4 w-4" />
      case "view":
        return <Eye className="h-4 w-4" />
      case "download":
        return <Download className="h-4 w-4" />
      case "update":
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique d'activité</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="mt-1 rounded-full bg-muted p-2">
                {getIcon(activity.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.details}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune activité à afficher
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}