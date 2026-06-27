import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, FileText, BarChart3, Heart, Settings, Lock } from "lucide-react"

export default function ProfileDetailsCard({
  user,
  myBlogsCount,
  totalViews,
  totalLikes,
  formatDate,
  onEditProfile,
  onChangePassword
}) {
  const isAdmin = user?.role === "ADMIN"

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 p-2">
      {/* Sleek Minimalist Cover Banner (Solid Neutral) */}
      <div className="h-28 w-full bg-zinc-50 dark:bg-zinc-900/40 relative flex items-center justify-center overflow-hidden rounded-2xl border-b border-zinc-200/50 dark:border-zinc-800/50">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:12px_12px] opacity-70" />
      </div>
      
      <CardContent className="pt-0 pb-6 flex flex-col items-center text-center relative px-4 sm:px-6">
        
        {/* Simple crisp avatar with solid borders */}
        <div className="relative -mt-10 h-20 w-20 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 flex items-center justify-center text-3xl font-black capitalize shadow-sm select-none z-10">
          {user?.username?.charAt(0)}
        </div>

        {/* Username */}
        <h2 className="text-xl font-bold mt-4 capitalize text-foreground tracking-tight">
          {user?.username}
        </h2>

        {/* Role Badge */}
        <div className="flex mt-2">
          {isAdmin ? (
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200/30 dark:border-rose-800/20">
              {user?.role}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
              {user?.role}
            </span>
          )}
        </div>

        {/* Metrics Grid (Minimalist Solid Panels) */}
        <div className="grid grid-cols-3 gap-3 w-full mt-6 select-none">
          {/* Articles */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-2.5 flex flex-col items-center justify-center transition-colors duration-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50">
            <FileText className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400 mb-1.5 shrink-0" />
            <span className="text-sm sm:text-base font-bold text-foreground leading-none">{myBlogsCount}</span>
            <span className="text-[8px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider mt-1.5">Articles</span>
          </div>

          {/* Views */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-2.5 flex flex-col items-center justify-center transition-colors duration-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50">
            <BarChart3 className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400 mb-1.5 shrink-0" />
            <span className="text-sm sm:text-base font-bold text-foreground leading-none">{totalViews.toLocaleString()}</span>
            <span className="text-[8px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider mt-1.5">Views</span>
          </div>

          {/* Likes */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-2.5 flex flex-col items-center justify-center transition-colors duration-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50">
            <Heart className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400 mb-1.5 shrink-0" />
            <span className="text-sm sm:text-base font-bold text-foreground leading-none">{totalLikes.toLocaleString()}</span>
            <span className="text-[8px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-wider mt-1.5">Likes</span>
          </div>
        </div>

        {/* Credentials detail card block */}
        <div className="w-full mt-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/40 rounded-2xl p-4 space-y-3 text-left">
          <div className="flex items-center gap-2.5 text-muted-foreground min-w-0">
            <Mail className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider leading-none">Email Address</p>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 text-muted-foreground min-w-0">
            <Calendar className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-wider leading-none">Joined Date</p>
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate mt-0.5">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="w-full mt-6 flex flex-col gap-2 shrink-0">
          <Button 
            onClick={onEditProfile} 
            className="w-full h-10 flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-xs shadow-sm active:scale-[0.98] transition-all border-none cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Edit Profile Info</span>
          </Button>
          <Button 
            onClick={onChangePassword} 
            className="w-full h-10 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 bg-transparent text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Change Password</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
