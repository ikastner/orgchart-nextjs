import { jsPDF } from 'jspdf'
import { OrgChartData } from './types'

export function generatePDF(element: HTMLElement) {
  try {
    const data = extractDataFromDOM(element)
    
    // Calculer les dimensions nécessaires
    const { width, height } = calculateDimensions(data)
    
    // Configuration de base
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [width + 100, height + 100] // Ajouter des marges
    })

    // En-tête
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Organigramme', width / 2, 50, { align: 'center' })

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    const date = new Date().toLocaleString('fr-FR')
    pdf.text(`Généré le ${date}`, width / 2, 70, { align: 'center' })

    // Dessiner l'organigramme
    drawNode(pdf, data, width / 2, 120, width - 100)

    // Pied de page
    pdf.setFontSize(8)
    pdf.setTextColor(100)
    pdf.text('Document confidentiel', width / 2, height + 80, { align: 'center' })

    pdf.save('organigramme.pdf')
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}

function calculateDimensions(data: OrgChartData): { width: number; height: number } {
  const nodeWidth = 200
  const nodeHeight = 80
  const horizontalGap = 40
  const verticalGap = 60

  function calculateLevel(node: OrgChartData, level: number = 0, counts: number[] = []): number[] {
    counts[level] = (counts[level] || 0) + 1
    if (node.children) {
      node.children.forEach(child => calculateLevel(child, level + 1, counts))
    }
    return counts
  }

  const levelCounts = calculateLevel(data)
  const maxNodesInLevel = Math.max(...levelCounts)
  const levels = levelCounts.length

  const width = Math.max(
    maxNodesInLevel * (nodeWidth + horizontalGap),
    1000 // Minimum width
  )
  const height = Math.max(
    levels * (nodeHeight + verticalGap),
    700 // Minimum height
  )

  return { width, height }
}

function drawNode(pdf: jsPDF, node: OrgChartData, x: number, y: number, width: number) {
  const nodeHeight = 80
  const nodeWidth = 180
  const verticalGap = 60
  const horizontalGap = 40

  // Dessiner le rectangle
  pdf.setDrawColor(200)
  pdf.setFillColor(255)
  pdf.roundedRect(x - nodeWidth / 2, y, nodeWidth, nodeHeight, 3, 3, 'FD')

  // Ajouter le texte
  pdf.setTextColor(0)
  
  // Nom
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text(node.name, x, y + 25, { align: 'center', maxWidth: nodeWidth - 20 })

  // Titre
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(node.title, x, y + 45, { align: 'center', maxWidth: nodeWidth - 20 })

  // Département
  pdf.setFontSize(9)
  pdf.setTextColor(100)
  pdf.text(node.department, x, y + 62, { align: 'center', maxWidth: nodeWidth - 20 })

  // Dessiner les enfants
  if (node.children && node.children.length > 0) {
    const childrenWidth = width / node.children.length
    const startX = x - (width / 2) + (childrenWidth / 2)

    // Ligne verticale depuis le parent
    pdf.setDrawColor(200)
    pdf.setLineWidth(0.5)
    pdf.line(x, y + nodeHeight, x, y + nodeHeight + verticalGap / 3)

    // Ligne horizontale pour connecter tous les enfants
    if (node.children.length > 1) {
      pdf.line(
        startX,
        y + nodeHeight + verticalGap / 3,
        startX + (node.children.length - 1) * childrenWidth,
        y + nodeHeight + verticalGap / 3
      )
    }

    // Dessiner chaque enfant
    node.children.forEach((child, index) => {
      const childX = startX + (index * childrenWidth)
      const childY = y + nodeHeight + verticalGap

      // Ligne verticale vers l'enfant
      pdf.line(childX, y + nodeHeight + verticalGap / 3, childX, childY)

      // Dessiner l'enfant
      drawNode(pdf, child, childX, childY, childrenWidth - horizontalGap)
    })
  }
}

function extractDataFromDOM(element: HTMLElement): OrgChartData {
  const rootNode = element.querySelector('.org-chart-node')
  if (!rootNode) throw new Error('Aucun organigramme trouvé')

  function parseNode(node: Element): OrgChartData {
    const nameEl = node.querySelector('h3')
    const titleEl = node.querySelector('p:not(.text-muted-foreground)')
    const deptEl = node.querySelector('.text-muted-foreground')
    
    const childrenContainer = node.querySelector('.children-wrapper')
    const children = childrenContainer
      ? Array.from(childrenContainer.querySelectorAll(':scope > .child-node > .org-chart-node'))
          .map(child => parseNode(child))
      : []

    return {
      id: node.getAttribute('data-id') || '',
      name: nameEl?.textContent || '',
      title: titleEl?.textContent || '',
      department: deptEl?.textContent || '',
      children: children.length > 0 ? children : undefined
    }
  }

  return parseNode(rootNode)
}