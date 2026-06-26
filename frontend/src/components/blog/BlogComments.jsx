import * as React from "react"
import { MessageSquare, Loader2, Send, Edit3, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function BlogComments({
  user,
  blogAuthorName,
  comments,
  commentsLoading,
  newComment,
  setNewComment,
  submittingComment,
  editingCommentId,
  setEditingCommentId,
  editingContent,
  setEditingContent,
  savingCommentId,
  onAddComment,
  onDeleteComment,
  onSaveEditComment
}) {
  const triggerAuthModal = () => {
    window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode: "login" } }))
  }

  return (
    <section className="space-y-6 pt-8 border-t border-zinc-150 dark:border-zinc-800/80 select-none">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-zinc-500" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Comment input form */}
      {user ? (
        <form onSubmit={onAddComment} className="flex gap-4 items-start bg-zinc-50/50 dark:bg-zinc-900/10 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="h-9 w-9 rounded-full bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold capitalize select-none border border-rose-200/20 shrink-0">
            {user.username.charAt(0)}
          </div>
          <div className="flex-grow space-y-3">
            <Textarea
              placeholder="Share your thoughts, ask a question, or leave feedback..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full resize-none text-sm font-medium border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent"
              disabled={submittingComment}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!newComment.trim() || submittingComment} className="flex items-center gap-1.5 h-9 font-bold px-4 rounded-xl bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
                {submittingComment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Comment</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 px-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-3">
            Join the conversation. Sign in to write a comment and interact.
          </p>
          <Button
            size="sm"
            onClick={triggerAuthModal}
            className="font-bold rounded-xl"
          >
            Sign In to Comment
          </Button>
        </div>
      )}

      {/* Comments list */}
      {commentsLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-xl bg-transparent">
          No comments yet. Start the discussion!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner = user && comment.authorName === user.username
            const canDelete = user && (isOwner || user.role === "ADMIN")
            const isEditing = editingCommentId === comment.id

            return (
              <div key={comment.id} className="flex gap-4 items-start p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/10 hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors">
                {/* User Initial Avatar */}
                <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold capitalize select-none border border-zinc-200/50 shrink-0">
                  {comment.authorName.charAt(0)}
                </div>

                {/* Comment Content */}
                <div className="flex-grow space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 capitalize truncate">
                        {comment.authorName}
                      </span>
                      {comment.authorName === blogAuthorName && (
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-extrabold bg-rose-500/5 text-rose-600 border-rose-500/20 rounded-md">
                          Author
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 font-medium shrink-0">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 pt-1.5">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={2}
                        className="w-full resize-none text-sm font-medium border-zinc-200 dark:border-zinc-800 rounded-lg bg-transparent"
                        disabled={savingCommentId === comment.id}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCommentId(null)}
                          disabled={savingCommentId === comment.id}
                          className="h-8 text-xs font-bold rounded-lg"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onSaveEditComment(comment.id)}
                          disabled={!editingContent.trim() || savingCommentId === comment.id}
                          className="h-8 text-xs font-bold rounded-lg"
                        >
                          {savingCommentId === comment.id && (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          )}
                          <span>Save</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-wrap select-text">
                        {comment.content}
                      </p>

                      {/* Actions */}
                      {user && (isOwner || canDelete) && (
                        <div className="flex items-center gap-3 pt-1">
                          {isOwner && (
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.id)
                                setEditingContent(comment.content)
                              }}
                              className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 transition-colors bg-transparent border-0 cursor-pointer p-0"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => onDeleteComment(comment.id)}
                              className="text-xs font-bold text-zinc-400 hover:text-rose-500 flex items-center gap-1.5 transition-colors bg-transparent border-0 cursor-pointer p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
