export interface Employee {
  id: string
  name: string
  title: string
  department: string
  managerId: string | null
  email?: string
  imageUrl?: string
}

export interface OrgChartData {
  id: string
  name: string
  title: string
  department: string
  email?: string
  imageUrl?: string
  children?: OrgChartData[]
}

export interface ChartStorage {
  data: OrgChartData
  timestamp: number
}