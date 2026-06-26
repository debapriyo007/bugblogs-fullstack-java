import * as React from "react"

export default function DonutChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const radius = 50
  const strokeWidth = 14
  const circumference = 2 * Math.PI * radius
  
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-xs">
        No category data available
      </div>
    )
  }

  // Curated, premium theme-appropriate colors
  const colors = [
    "stroke-violet-500",
    "stroke-emerald-500",
    "stroke-cyan-500",
    "stroke-amber-500",
    "stroke-rose-500",
    "stroke-sky-500",
    "stroke-indigo-500"
  ]
  const fillColors = [
    "bg-violet-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-sky-500",
    "bg-indigo-500"
  ]
  const textColors = [
    "text-violet-500",
    "text-emerald-500",
    "text-cyan-500",
    "text-amber-500",
    "text-rose-500",
    "text-sky-500",
    "text-indigo-500"
  ]

  const chartItems = data.map((item, idx) => {
    const percent = total > 0 ? item.count / total : 0
    const offset = data.slice(0, idx).reduce((sum, prevItem) => sum + (total > 0 ? prevItem.count / total : 0), 0)
    return {
      ...item,
      percent,
      offset,
      colorClass: colors[idx % colors.length]
    }
  })

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Base Background Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-muted"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {chartItems.map((item) => {
            const strokeLength = item.percent * circumference
            const strokeOffset = circumference - (item.offset * circumference)
            
            return (
              <circle
                key={item.name}
                cx="60"
                cy="60"
                r={radius}
                className={`${item.colorClass} transition-all duration-500 hover:opacity-80`}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="transparent"
              >
                <title>{`${item.name}: ${item.count} (${Math.round(item.percent * 100)}%)`}</title>
              </circle>
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-bold tracking-tight text-foreground">{total}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Blogs</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex-1 space-y-2 min-w-[140px] w-full">
        {data.slice(0, 5).map((item, idx) => {
          const percent = Math.round((item.count / total) * 100)
          const bgColor = fillColors[idx % fillColors.length]
          const textColor = textColors[idx % textColors.length]
          return (
            <div key={item.name} className="flex items-center justify-between text-xs hover:bg-muted/30 px-2.5 py-1 rounded transition-colors">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${bgColor}`}></span>
                <span className="font-medium text-foreground truncate capitalize">{item.name}</span>
              </div>
              <span className={`font-mono font-semibold ${textColor}`}>{percent}%</span>
            </div>
          )
        })}
        {data.length > 5 && (
          <div className="text-[10px] text-muted-foreground text-center pt-1 italic">
            + {data.length - 5} more categories
          </div>
        )}
      </div>
    </div>
  )
}
