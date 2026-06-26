import * as React from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Check, Edit2, Trash2, ArrowLeft } from "lucide-react"

export default function SocialShareActions({
  blog,
  liked,
  likeCount,
  likeLoading,
  copied,
  canManage,
  onLike,
  onShare,
  onDelete,
  onNavigateBack
}) {
  const triggerEditModal = () => {
    if (blog) {
      window.dispatchEvent(new CustomEvent("open-editor-modal", { detail: { editBlogId: blog.id } }))
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-150 dark:border-zinc-800/80 pb-4 flex-wrap">
      <Button variant="ghost" size="sm" onClick={onNavigateBack} className="flex items-center gap-1 hover:bg-muted rounded-xl">
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
      
      <div className="flex items-center gap-2 flex-wrap">
        {/* Like Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onLike}
          className={`flex items-center gap-1.5 transition-all rounded-xl ${
            liked
              ? "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/25"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          disabled={likeLoading}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`} />
          <span className="font-bold">{likeCount}</span>
        </Button>

        {/* Share */}
        <Button variant="outline" size="sm" onClick={onShare} className="flex items-center gap-1 rounded-xl">
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          <span>{copied ? "Link Copied" : "Share"}</span>
        </Button>

        {/* Manage controls (Author / Admin) */}
        {canManage && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 rounded-xl"
              onClick={triggerEditModal}
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Post</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive flex items-center gap-1 rounded-xl"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
