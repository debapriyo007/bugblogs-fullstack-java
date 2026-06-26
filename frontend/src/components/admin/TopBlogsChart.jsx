import * as React from "react"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TopBlogsChart({ data }) {
  const maxViews = Math.max(...data.map(b => b.viewCount || 0), 1)
  
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-xs">
        No blogs views data available.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((blog, idx) => {
        const percent = ((blog.viewCount || 0) / maxViews) * 100
        return (
          <div key={blog.id} className="space-y-1.5 hover:bg-muted/10 p-2 rounded-lg transition-all duration-200">
            <div className="flex items-center justify-between text-xs gap-4">
              <span className="font-semibold text-foreground truncate max-w-[240px] capitalize">
                {idx + 1}. {blog.title}
              </span>
              <span className="text-muted-foreground font-mono shrink-0 flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{blog.viewCount || 0}</span>
              </span>
            </div>
            
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-1000 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">
                By <span className="font-semibold text-foreground capitalize">{blog.author.username}</span>
              </span>
              <Badge variant="outline" className="px-1.5 py-0 bg-secondary text-[8px] font-semibold">
                {blog.category?.name || "Uncategorized"}
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
