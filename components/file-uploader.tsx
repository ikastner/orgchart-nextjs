"use client"

import { useCallback } from "react"
import Papa from "papaparse"
import { OrgChartData } from "@/lib/types"
import { processCSVData } from "@/lib/csv-processor"
import { useToast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/ui/file-upload"

interface FileUploaderProps {
  onDataLoaded: (data: OrgChartData) => void
}

export function FileUploader({ onDataLoaded }: FileUploaderProps) {
  const { toast } = useToast()

  const handleFileAccepted = useCallback((file: File) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      transform: (value) => value.trim(),
      complete: (results) => {
        try {
          const processedData = processCSVData(results.data)
          onDataLoaded(processedData)
          toast({
            title: "Succès",
            description: "Données de l'organigramme chargées avec succès",
          })
        } catch (error) {
          toast({
            title: "Erreur lors du traitement du fichier",
            description: error instanceof Error ? error.message : "Format de fichier invalide",
            variant: "destructive",
          })
        }
      },
      error: (error) => {
        toast({
          title: "Erreur de lecture du fichier",
          description: error.message,
          variant: "destructive",
        })
      },
    })
  }, [onDataLoaded, toast])

  const handleError = useCallback((error: string) => {
    toast({
      title: "Erreur",
      description: error,
      variant: "destructive",
    })
  }, [toast])

  return (
    <div className="space-y-6">
      <FileUpload 
        onFileAccepted={handleFileAccepted}
        onError={handleError}
        maxSize={1024 * 1024} // 1MB
      />

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <h3 className="font-medium mb-2">Format CSV requis :</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Le fichier doit être au format CSV</li>
            <li>La première ligne doit contenir les en-têtes</li>
            <li>Colonnes requises : id, name, title, department, managerId</li>
            <li>Colonnes optionnelles : email, imageUrl</li>
            <li>Le PDG/employé racine doit avoir un managerId vide</li>
          </ul>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Exemple de format CSV :</h4>
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
{`id,name,title,department,managerId,email,imageUrl
1,Jean Dupont,PDG,Direction,,jean@example.com,
2,Marie Martin,DRH,Ressources Humaines,1,marie@example.com,
3,Pierre Durand,Développeur,Technique,2,pierre@example.com,`}
          </pre>
        </div>
      </div>
    </div>
  )
}