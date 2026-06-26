import { Users, BookOpen, Code, MessageSquare, Sparkles, Shield, Heart } from "lucide-react"

export default function About() {
  const stats = [
    { label: "Active Writers", value: "10K+", icon: Users },
    { label: "Articles Published", value: "5K+", icon: BookOpen },
    { label: "Bugs Documented", value: "1.2K+", icon: Code },
    { label: "Daily Readers", value: "25K+", icon: MessageSquare }
  ]

  const principles = [
    {
      title: "Community First",
      description: "Fostering respect, collaboration, and high-quality dialogue across technical branches.",
      icon: Users
    },
    {
      title: "Clarity Over Complexity",
      description: "Ensuring complex system architectures and code logs are legible and structured.",
      icon: Sparkles
    },
    {
      title: "Open Knowledge",
      description: "Sharing debugging journeys and post-mortems so others don't have to resolve the same bugs twice.",
      icon: Heart
    },
    {
      title: "Content Integrity",
      description: "Active moderation and curation to maintain high standards of dev community publications.",
      icon: Shield
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-8 md:py-12 animate-fade-in select-none">
      
      {/* Hero Header */}
      <section className="space-y-4 text-left border-b border-border/40 pb-8">
        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
          The Developer Sanctuary
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          About <span style={{ fontFamily: "'Caveat', cursive" }} className="text-rose-600 font-bold">bugblogs<span className="text-rose-600">.</span></span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          bugblogs is a publishing space built for developers, system engineers, and tech enthusiasts. 
          A platform to document bug-hunting expeditions, architecture reviews, and engineering logs in a clean, readable layout.
        </p>
      </section>

      {/* Narrative & Stats Split Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Column 1: Core Narrative */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Documenting the Uncharted Code
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>
              Every developer has faced issues that took hours or days to solve, only to find no trace of documentation online. bugblogs was built to turn those frustrating moments into valuable learning resources.
            </p>
            <p>
              By offering clean technical layouts—including an IDE-style code visualizer, syntax styling, and markdown editing tools—we make publishing technical guides feel natural and rewarding.
            </p>
          </div>
        </div>

        {/* Column 2: Grid of Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/20 hover:border-rose-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <Icon className="h-4 w-4 text-zinc-400 group-hover:text-rose-500 transition-colors" />
                </div>
                <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {stat.value}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Principles Section */}
      <section className="space-y-8">
        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Our Core Principles
          </h2>
          <p className="text-xs text-muted-foreground">
            The foundational guidelines shaping our platform guidelines and updates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {principles.map((val, idx) => {
            const Icon = val.icon
            return (
              <div 
                key={idx} 
                className="flex gap-4 p-6 rounded-3xl border border-zinc-150 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
              >
                <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
                    {val.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}
