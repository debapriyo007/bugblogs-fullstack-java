import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, FileText, BarChart3, Heart, Settings, Lock } from "lucide-react"
import LogoBug from "../LogoBug"

export default function ProfileDetailsCard({
  user,
  myBlogsCount,
  totalViews,
  totalLikes,
  formatDate,
  onEditProfile,
  onChangePassword
}) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none overflow-hidden rounded-3xl bg-white dark:bg-zinc-950 p-2">
      {/* Elegant User Cover Banner with Bug Logo & Black Gradient */}
      <div className="h-24 w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black relative flex items-center justify-center overflow-hidden rounded-2xl border-b border-border/20">
        {/* Subtle geometric line grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 pointer-events-none" />
        {/* Subtle watermarked ladybug logo */}
        <LogoBug className="absolute right-4 bottom-2 h-20 w-20 opacity-[0.03] pointer-events-none" animated={false} />
      </div>
      
      <CardContent className="pt-0 pb-6 flex flex-col items-center text-center relative px-6">
        
        {/* Overlapping Avatar initial circular badge */}
        <div className="h-20 w-20 rounded-full bg-rose-600 text-white flex items-center justify-center text-3xl font-black capitalize border-4 border-white dark:border-zinc-950 shadow-md -mt-10 select-none z-10">
          {user?.username?.charAt(0)}
        </div>

        <h2 className="text-2xl font-black mt-3 capitalize text-foreground tracking-tight">{user?.username}</h2>
        <div className="flex mt-1.5">
          <Badge variant={user?.role === "ADMIN" ? "destructive" : "secondary"} className="uppercase font-extrabold tracking-wider text-[9px] px-2 py-0.5">
            {user?.role}
          </Badge>
        </div>

        {/* Total User Metric Cards */}
        <div className="grid grid-cols-3 gap-2 w-full border-t border-b border-border/40 py-4 mt-6 select-none">
          <div className="text-center flex flex-col items-center justify-center">
            <FileText className="h-4.5 w-4.5 text-black dark:text-white mb-1 shrink-0" />
            <span className="text-base font-black text-foreground leading-none">{myBlogsCount}</span>
            <span className="text-[8px] text-muted-foreground uppercase font-extrabold tracking-wider mt-1">Articles</span>
          </div>
          <div className="text-center flex flex-col items-center justify-center border-l border-border/40">
            <BarChart3 className="h-4.5 w-4.5 text-black dark:text-white mb-1 shrink-0" />
            <span className="text-base font-black text-foreground leading-none">{totalViews.toLocaleString()}</span>
            <span className="text-[8px] text-muted-foreground uppercase font-extrabold tracking-wider mt-1">Views</span>
          </div>
          <div className="text-center flex flex-col items-center justify-center border-l border-border/40">
            <Heart className="h-4.5 w-4.5 text-black dark:text-white mb-1 shrink-0" />
            <span className="text-base font-black text-foreground leading-none">{totalLikes.toLocaleString()}</span>
            <span className="text-[8px] text-muted-foreground uppercase font-extrabold tracking-wider mt-1">Likes</span>
          </div>
        </div>

        {/* User credentials details links */}
        <div className="w-full mt-6 space-y-3.5 text-sm text-left">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground/75" />
            <span className="truncate text-xs font-semibold">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground/75" />
            <span className="text-xs font-semibold">Joined: {formatDate(user?.createdAt)}</span>
          </div>
        </div>

        {/* Open Edit Profile & Change Password Dialog Triggers */}
        <div className="w-full mt-6 flex flex-col gap-2 shrink-0">
          <Button onClick={onEditProfile} className="w-full flex items-center justify-center gap-1.5 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-muted" variant="outline">
            <Settings className="h-3.5 w-3.5" />
            <span>Edit Profile Info</span>
          </Button>
          <Button onClick={onChangePassword} className="w-full flex items-center justify-center gap-1.5 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-muted" variant="outline">
            <Lock className="h-3.5 w-3.5" />
            <span>Change Password</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
