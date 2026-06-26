import * as React from "react"

export default function LineChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = React.useState(null)
  
  const trendData = data
  const maxVal = Math.max(...trendData.map(d => Math.max(d.users, d.blogs)), 5)
  
  const chartWidth = 500
  const chartHeight = 220
  const paddingLeft = 40
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 35
  
  const plotWidth = chartWidth - paddingLeft - paddingRight
  const plotHeight = chartHeight - paddingTop - paddingBottom
  
  const getX = (index) => paddingLeft + (index / (trendData.length - 1)) * plotWidth
  const getY = (val) => chartHeight - paddingBottom - (val / maxVal) * plotHeight
  
  const blogsPoints = trendData.map((d, i) => `${getX(i)},${getY(d.blogs)}`)
  const blogsPath = "M " + blogsPoints.join(" L ")
  const blogsAreaPath = blogsPoints.length 
    ? `M ${getX(0)},${chartHeight - paddingBottom} L ` + blogsPoints.join(" L ") + ` L ${getX(trendData.length - 1)},${chartHeight - paddingBottom} Z` 
    : ""
    
  const usersPoints = trendData.map((d, i) => `${getX(i)},${getY(d.users)}`)
  const usersPath = "M " + usersPoints.join(" L ")
  const usersAreaPath = usersPoints.length 
    ? `M ${getX(0)},${chartHeight - paddingBottom} L ` + usersPoints.join(" L ") + ` L ${getX(trendData.length - 1)},${chartHeight - paddingBottom} Z` 
    : ""

  const handleMouseMove = (e) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const svgX = (x / rect.width) * chartWidth
    
    let closestIdx = 0
    let minDiff = Infinity
    for (let i = 0; i < trendData.length; i++) {
      const ptX = getX(i)
      const diff = Math.abs(svgX - ptX)
      if (diff < minDiff) {
        minDiff = diff
        closestIdx = i
      }
    }
    setHoveredIdx(closestIdx)
  }

  // Y-axis grid lines (4 lines)
  const gridLines = [0, 0.33, 0.66, 1].map(ratio => {
    const val = Math.round(ratio * maxVal)
    const y = getY(val)
    return { val, y }
  })

  return (
    <div className="relative w-full">
      <svg 
        className="w-full h-auto overflow-visible select-none" 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="blogsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, idx) => (
          <g key={idx} className="opacity-40">
            <line 
              x1={paddingLeft} 
              y1={line.y} 
              x2={chartWidth - paddingRight} 
              y2={line.y} 
              className="stroke-border" 
              strokeWidth="1" 
              strokeDasharray="4 4"
            />
            <text 
              x={paddingLeft - 10} 
              y={line.y + 4} 
              textAnchor="end" 
              className="fill-muted-foreground text-[10px] font-mono"
            >
              {line.val}
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {trendData.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={chartHeight - 10}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] font-semibold"
          >
            {d.label}
          </text>
        ))}

        {/* Areas */}
        <path d={blogsAreaPath} fill="url(#blogsGrad)" />
        <path d={usersAreaPath} fill="url(#usersGrad)" />

        {/* Lines */}
        <path d={blogsPath} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={usersPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Active hovered point indicators */}
        {hoveredIdx !== null && (
          <g>
            {/* Dashed vertical indicator line */}
            <line 
              x1={getX(hoveredIdx)} 
              y1={paddingTop} 
              x2={getX(hoveredIdx)} 
              y2={chartHeight - paddingBottom} 
              className="stroke-muted-foreground/40" 
              strokeWidth="1.5" 
              strokeDasharray="2 2"
            />
            
            {/* Blogs point */}
            <circle 
              cx={getX(hoveredIdx)} 
              cy={getY(trendData[hoveredIdx].blogs)} 
              r="5" 
              className="fill-background stroke-primary" 
              strokeWidth="2.5" 
            />
            
            {/* Users point */}
            <circle 
              cx={getX(hoveredIdx)} 
              cy={getY(trendData[hoveredIdx].users)} 
              r="5" 
              className="fill-background stroke-emerald-500" 
              strokeWidth="2.5" 
            />
          </g>
        )}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIdx !== null && (
        <div 
          className="absolute z-20 pointer-events-none bg-card/95 border border-border shadow-lg p-2.5 rounded-lg text-xs space-y-1 animate-zoom-in backdrop-blur-md"
          style={{
            left: `${Math.min(
              Math.max(
                (getX(hoveredIdx) / chartWidth) * 100 - 15,
                5
              ),
              75
            )}%`,
            top: "8px"
          }}
        >
          <div className="font-semibold text-foreground border-b border-border/50 pb-1 mb-1">
            {trendData[hoveredIdx].label} Overview
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-foreground"></span>
              <span>New Blogs:</span>
            </span>
            <span className="font-mono font-bold text-foreground">{trendData[hoveredIdx].blogs}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>New Users:</span>
            </span>
            <span className="font-mono font-bold text-emerald-500">{trendData[hoveredIdx].users}</span>
          </div>
        </div>
      )}
    </div>
  )
}
