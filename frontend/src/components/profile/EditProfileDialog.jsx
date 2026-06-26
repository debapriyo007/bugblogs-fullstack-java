import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

export default function EditProfileDialog({
  open,
  onOpenChange,
  username,
  setUsername,
  email,
  setEmail,
  loading,
  error,
  success,
  onUpdate
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Update Profile Info</DialogTitle>
          <DialogDescription className="text-xs">
            Update your account username and primary email contact details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onUpdate} className="space-y-4 pt-2">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="modal-profile-username" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Username</Label>
            <Input
              id="modal-profile-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="modal-profile-email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</Label>
            <Input
              id="modal-profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
            />
          </div>

          <DialogFooter className="pt-4 flex gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
