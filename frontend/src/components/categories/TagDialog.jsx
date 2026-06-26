import * as React from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TagDialog({
  open,
  onOpenChange,
  tagDialogMode,
  tag,
  actionLoading,
  onSave
}) {
  const [tagName, setTagName] = React.useState("")
  const [tagError, setTagError] = React.useState(null)

  React.useEffect(() => {
    if (open) {
      setTagName(tag ? tag.name : "")
      setTagError(null)
    }
  }, [open, tag])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTagError(null)
    if (!tagName.trim()) {
      setTagError("Tag name is required")
      return
    }

    try {
      await onSave(tagName.trim())
      onOpenChange(false)
    } catch (err) {
      setTagError(err.message || "An error occurred during tag operation")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {tagDialogMode === "create" ? "Create New Tag" : "Edit Tag"}
          </DialogTitle>
          <DialogDescription>
            {tagDialogMode === "create"
              ? "Add a tag badge to group specific frameworks or subtopics."
              : "Modify the tag name badge. Live posts using this tag will sync automatically."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tagError && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{tagError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="tag-name" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tag Name</Label>
            <Input
              id="tag-name"
              type="text"
              placeholder="Lowercase tag slug (no spaces)"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              disabled={actionLoading}
              className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={actionLoading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={actionLoading} className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{tagDialogMode === "create" ? "Create Tag" : "Save Changes"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
