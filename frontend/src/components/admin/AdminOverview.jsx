import { Users, BookOpen, Eye, TrendingUp, BarChart3 } from "lucide-react"
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import LineChart from "./LineChart"
import DonutChart from "./DonutChart"
import TopBlogsChart from "./TopBlogsChart"

export default function AdminOverview({
  userCount,
  blogsTotalElements,
  totalViews,
  avgViews,
  trendData,
  categoryData,
  topBlogs,
  analyticsLoading
}) {
  if (analyticsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <Card key={n} className="border border-zinc-200 dark:border-zinc-800 shadow-none rounded-2xl bg-white dark:bg-zinc-950">
              <CardContent className="pt-6">
                <div className="h-3 w-20 bg-muted rounded mb-2"></div>
                <div className="h-6 w-12 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Chart Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none p-6 lg:col-span-2 space-y-4 rounded-3xl bg-white dark:bg-zinc-950">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded w-full"></div>
          </Card>
          <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none p-6 space-y-4 rounded-3xl bg-white dark:bg-zinc-950">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded w-full"></div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm shadow-none rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/5 hover:border-blue-500/25 group">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Members</span>
              <h3 className="text-2xl font-extrabold text-foreground">{userCount}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center border border-blue-100 dark:border-blue-950/50 transition-colors duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardContent>
        </Card>

        {/* Total Blogs */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm shadow-none rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/5 hover:border-emerald-500/25 group">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Blogs</span>
              <h3 className="text-2xl font-extrabold text-foreground">{blogsTotalElements}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-950/50 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardContent>
        </Card>

        {/* Total Reads */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm shadow-none rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-violet-500/5 hover:border-violet-500/25 group">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Reads</span>
              <h3 className="text-2xl font-extrabold text-foreground">{totalViews.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center border border-violet-100 dark:border-violet-950/50 transition-colors duration-300 group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500">
              <Eye className="h-4 w-4 text-violet-600 dark:text-violet-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardContent>
        </Card>

        {/* Avg Views */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm shadow-none rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-500/5 hover:border-amber-500/25 group">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg views / blog</span>
              <h3 className="text-2xl font-extrabold text-foreground">{avgViews}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center border border-amber-100 dark:border-amber-950/50 transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500">
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart Component Card (Growth Trends) */}
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none p-6 lg:col-span-2 space-y-4 rounded-3xl bg-white dark:bg-zinc-950">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Platform Growth Trends</span>
              </CardTitle>
              <CardDescription className="text-[10px] text-muted-foreground mt-0.5">
                User registrations and blog publications over the last 6 months.
              </CardDescription>
            </div>
            {/* Custom Legend */}
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-foreground"></span>
                <span className="text-muted-foreground">Blogs</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-muted-foreground">Users</span>
              </span>
            </div>
          </div>
          
          <div className="pt-2">
            <LineChart data={trendData} />
          </div>
        </Card>

        {/* Donut Chart Component Card (Categories) */}
        <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none p-6 space-y-4 rounded-3xl bg-white dark:bg-zinc-950">
          <div className="border-b border-border/40 pb-3">
            <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Categories Distribution</span>
            </CardTitle>
            <CardDescription className="text-[10px] text-muted-foreground mt-0.5">
              Distribution of posts across categories.
            </CardDescription>
          </div>
          
          <div className="pt-2">
            <DonutChart data={categoryData} />
          </div>
        </Card>
      </div>

      {/* Top Performing Blogs Table / Bar Chart */}
      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none p-6 space-y-4 rounded-3xl bg-white dark:bg-zinc-950">
        <div className="border-b border-border/40 pb-3">
          <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span>Top Performing Articles</span>
          </CardTitle>
          <CardDescription className="text-[10px] text-muted-foreground mt-0.5">
            Most viewed posts published on the platform.
          </CardDescription>
        </div>
        
        <div className="pt-1">
          <TopBlogsChart data={topBlogs} />
        </div>
      </Card>
    </div>
  )
}
