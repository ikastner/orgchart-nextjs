"use client"

import { OrgChartData } from "@/lib/types"

export function convertToG6Format(data: OrgChartData): any {
  const convertNode = (node: OrgChartData): any => ({
    id: node.id,
    name: node.name,
    title: node.title,
    department: node.department,
    email: node.email,
    children: node.children?.map(convertNode),
  })

  return convertNode(data)
}