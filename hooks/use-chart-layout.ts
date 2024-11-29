"use client"

export function useChartLayout() {
  const layoutConfig = {
    type: 'compactBox',
    direction: 'LR',
    getId: function getId(d: any) {
      return d.id
    },
    getHeight: function getHeight() {
      return 120
    },
    getWidth: function getWidth() {
      return 240
    },
    getVGap: function getVGap() {
      return 40
    },
    getHGap: function getHGap() {
      return 100
    },
  }

  return {
    layoutConfig,
  }
}