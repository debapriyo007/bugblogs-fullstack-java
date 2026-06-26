import * as React from "react"
import { Tag as TagIcon, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EditorTagSelector({
  availableTags,
  selectedTagIds,
  onToggleTag,
  newTagName,
  setNewTagName,
  onAddTag,
  creatingTag,
  loading
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-wider">
        <TagIcon className="h-4 w-4" />
        <span>Associate Tags</span>
      </Label>
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/10">
          {availableTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id)
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onToggleTag(tag.id)}
                className={`px-3 py-1 text-xs font-bold rounded-full border transition-all active:scale-95 ${
                  isSelected
                    ? "bg-rose-600 text-white border-rose-600"
                    : "bg-white dark:bg-zinc-950 text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:border-rose-500"
                }`}
              >
                #{tag.name}
              </button>
            )
          })}
        </div>
      )}
      <div className="flex gap-2 max-w-xs pt-1">
        <Input
          type="text"
          placeholder="Type a tag and press Enter to add"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="h-9 text-xs rounded-xl border-zinc-200/80 dark:border-zinc-800"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onAddTag()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddTag}
          className="h-9 text-xs shrink-0 rounded-xl"
          disabled={creatingTag || loading}
        >
          {creatingTag ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add Tag"}
        </Button>
      </div>
    </div>
  )
}
