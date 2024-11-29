"use client"

import { useState, useRef, useEffect } from "react"
import { OrgChartData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Download, ChevronRight, ChevronDown } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import { useToast } from "@/components/ui/use-toast"
import { ZoomControls } from "@/components/zoom-controls"
import { ConfettiEffect } from "@/components/confetti-effect"

interface OrgChartViewerProps {
  data: OrgChartData
}

export function OrgChartViewer({ data }: OrgChartViewerProps) {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set())
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleDownload = () => {
    try {
      const element = document.querySelector('.org-chart-container')
      if (element) {
        generatePDF(element)
        
        const downloads = parseInt(localStorage.getItem('pdfDownloads') || '0')
        localStorage.setItem('pdfDownloads', (downloads + 1).toString())

        toast({
          title: "Succès",
          description: "L'organigramme a été exporté en PDF",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF",
        variant: "destructive",
      })
    }
  }

  const toggleNode = (nodeId: string) => {
    const newCollapsed = new Set(collapsedNodes)
    if (newCollapsed.has(nodeId)) {
      newCollapsed.delete(nodeId)
    } else {
      newCollapsed.add(nodeId)
    }
    setCollapsedNodes(newCollapsed)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true)
      setLastMousePos({ x: e.clientX, y: e.clientY })
      setStartPosition(position)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const PAN_SPEED = 2.5
      const deltaX = (e.clientX - lastMousePos.x) * PAN_SPEED
      const deltaY = (e.clientY - lastMousePos.y) * PAN_SPEED
      
      setPosition({
        x: startPosition.x + deltaX,
        y: startPosition.y + deltaY
      })
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setStartPosition(position)
    }
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const ZOOM_SENSITIVITY = 0.0015
        const delta = -e.deltaY * ZOOM_SENSITIVITY
        
        setZoom(prev => {
          const newZoom = prev + delta * prev * 2
          return Math.min(Math.max(0.1, newZoom), 5)
        })
      } else {
        // Enable smooth panning with mousewheel when not zooming
        e.preventDefault()
        const PAN_SPEED = 2
        setPosition(prev => ({
          x: prev.x - e.deltaX * PAN_SPEED,
          y: prev.y - e.deltaY * PAN_SPEED
        }))
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  const renderNode = (node: OrgChartData, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isCollapsed = collapsedNodes.has(node.id)

    return (
      <div key={node.id} className="org-chart-node" data-id={node.id}>
        <div className="node-card">
          <h3 className="font-semibold text-lg mb-1">{node.name}</h3>
          <p className="text-sm mb-1">{node.title}</p>
          <p className="text-sm text-muted-foreground">{node.department}</p>
          {node.email && (
            <p className="text-xs mt-2 text-muted-foreground">{node.email}</p>
          )}
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => toggleNode(node.id)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        {hasChildren && !isCollapsed && (
          <div className="children-container">
            <div className="children-wrapper">
              {node.children.map((child, index) => (
                <div key={child.id} className="child-node">
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ConfettiEffect />
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => {
            if (collapsedNodes.size > 0) {
              setCollapsedNodes(new Set())
            } else {
              const allNodes = new Set<string>()
              const addNodes = (node: OrgChartData) => {
                if (node.children) {
                  allNodes.add(node.id)
                  node.children.forEach(addNodes)
                }
              }
              addNodes(data)
              setCollapsedNodes(allNodes)
            }
          }}
        >
          {collapsedNodes.size > 0 ? "Tout déplier" : "Tout replier"}
        </Button>

        <div className="flex items-center gap-4">
          <ZoomControls
            zoom={zoom}
            onZoomChange={setZoom}
            onReset={() => {
              setZoom(1)
              setPosition({ x: 0, y: 0 })
            }}
          />
          
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="org-chart-container bg-background rounded-lg border overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          {renderNode(data)}
        </div>
      </div>
    </div>
  )
}