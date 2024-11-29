"use client"

import { useEffect, useRef, useState } from "react"
import { OrgChartData } from "@/lib/types"
import G6 from "@antv/g6"
import { useGraphConfig, layoutConfig } from "./graph-config"
import { registerCustomNode } from "./node-renderer"

interface OrgChartGraphProps {
  data: OrgChartData
}

export function OrgChartGraph({ data }: OrgChartGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<any>(null)
  const [mounted, setMounted] = useState(false)
  const { getNodeConfig, getEdgeConfig } = useGraphConfig()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current || !data) return

    const container = containerRef.current
    const width = container.offsetWidth
    const height = container.offsetHeight || 600

    if (graphRef.current) {
      graphRef.current.destroy()
      graphRef.current = null
    }

    registerCustomNode(G6)

    const graph = new G6.Graph({
      container,
      width,
      height,
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      layout: layoutConfig,
      defaultNode: getNodeConfig(),
      defaultEdge: getEdgeConfig(G6),
      fitView: true,
      animate: false,
    })

    const g6Data = {
      id: 'root',
      ...convertToG6Format(data),
    }

    try {
      graph.data(g6Data)
      graph.render()

      graph.set('animate', true)
      graph.set('animateCfg', {
        duration: 500,
        easing: 'easeCubic',
      })

      graph.on('afterlayout', () => {
        if (graphRef.current) {
          graphRef.current.fitView()
          graphRef.current.zoomTo(0.8)
        }
      })

      graphRef.current = graph

      const handleResize = () => {
        if (!graphRef.current) return
        const newWidth = container.offsetWidth
        const newHeight = container.offsetHeight || 600
        graphRef.current.changeSize(newWidth, newHeight)
        graphRef.current.fitView()
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (graphRef.current) {
          graphRef.current.destroy()
          graphRef.current = null
        }
      }
    } catch (error) {
      console.error('Error initializing graph:', error)
    }
  }, [data, getNodeConfig, getEdgeConfig, mounted])

  return (
    <div ref={containerRef} className="w-full h-[600px] border rounded-lg bg-background" />
  )
}

function convertToG6Format(data: OrgChartData): any {
  const convertNode = (node: OrgChartData): any => ({
    ...node,
    children: node.children?.map(convertNode),
  })

  return convertNode(data)
}