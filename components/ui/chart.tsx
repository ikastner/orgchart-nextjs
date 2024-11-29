"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={className}
      style={{
        ...Object.entries(config).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`--color-${key}`]: value.color,
          }),
          {}
        ),
      }}
      {...props}
    >
      {children}
    </div>
  )
}

interface ChartTooltipProps extends React.ComponentProps<typeof Tooltip> {
  content: React.ReactNode
}

export function ChartTooltip({ content, ...props }: ChartTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  hideLabel?: boolean
}

export function ChartTooltipContent({
  active,
  payload,
  hideLabel,
}: ChartTooltipContentProps) {
  if (!active || !payload) return null

  return (
    <div className="space-y-0.5">
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          {!hideLabel && (
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: item.color }}
            />
          )}
          <div className="space-x-1">
            {!hideLabel && (
              <span className="text-muted-foreground">{item.name}:</span>
            )}
            <span className="font-bold">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}