import * as React from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function CategoryDialog({
  open,
  onOpenChange,
  dialogMode,
  category,
  actionLoading,
  onSave
}) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (open) {
      setName(category ? category.name : "")
      setDescription(category ? (category.description || "") : "")
      setError(null)
    }
  }, [open, category])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError("Category name is required")
      return
    }

    try {
      await onSave({
        name: name.trim(),
        description: description.trim()
      })
      onOpenChange(false)
    } catch (err) {
      setError(err.message || "An error occurred during category operation")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialogMode === "create" ? "Create New Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {dialogMode === "create"
              ? "Add a new categorization tag so that authors can file posts correctly."
              : "Modify the category details. This will update live across all posts using it."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="category-name" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Category Name</Label>
            <Input
              id="category-name"
              type="text"
              placeholder="Name for this topic area"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={actionLoading}
              className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-description" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</Label>
            <Textarea
              id="category-description"
              placeholder="Describe the types of articles that belong in this category"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={actionLoading}
              rows={3}
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
                <span>{dialogMode === "create" ? "Create Category" : "Save Changes"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
