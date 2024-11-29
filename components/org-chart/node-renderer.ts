"use client"

import type { Graph } from "@antv/g6"
import { nodeStyles } from "./styles"

export function registerCustomNode(G6: typeof Graph) {
  G6.registerNode('custom-node', {
    draw: (cfg: any, group: any) => {
      const { name, title, department, email } = cfg
      const { container, text } = nodeStyles

      const keyShape = group.addShape('rect', {
        attrs: {
          x: -container.width / 2,
          y: -container.height / 2,
          width: container.width,
          height: container.height,
          radius: container.radius,
          fill: 'var(--card)',
          stroke: 'var(--border)',
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 4,
        },
        name: 'key-shape',
      })

      // Name
      group.addShape('text', {
        attrs: {
          text: name,
          x: 0,
          y: -container.height / 2 + container.padding + text.name.yOffset,
          textAlign: 'center',
          textBaseline: 'middle',
          fill: 'var(--foreground)',
          fontSize: text.name.fontSize,
          fontWeight: text.name.fontWeight,
        },
      })

      // Title
      group.addShape('text', {
        attrs: {
          text: title,
          x: 0,
          y: -container.height / 2 + container.padding + text.title.yOffset,
          textAlign: 'center',
          textBaseline: 'middle',
          fill: 'var(--primary)',
          fontSize: text.title.fontSize,
          fontWeight: text.title.fontWeight,
        },
      })

      // Department
      if (department) {
        group.addShape('text', {
          attrs: {
            text: department,
            x: 0,
            y: -container.height / 2 + container.padding + text.department.yOffset,
            textAlign: 'center',
            textBaseline: 'middle',
            fill: 'var(--muted-foreground)',
            fontSize: text.department.fontSize,
          },
        })
      }

      // Email
      if (email) {
        group.addShape('text', {
          attrs: {
            text: email,
            x: 0,
            y: -container.height / 2 + container.padding + text.email.yOffset,
            textAlign: 'center',
            textBaseline: 'middle',
            fill: 'var(--muted-foreground)',
            fontSize: text.email.fontSize,
            cursor: 'pointer',
          },
        })
      }

      return keyShape
    },
  })
}