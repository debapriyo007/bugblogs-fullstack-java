import * as React from "react"
import { Users, Trash2, Loader2, AlertCircle, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminUsers({
  users,
  usersPage,
  usersTotalPages,
  usersLoading,
  actionLoading,
  currentUser,
  onDeleteUser,
  onPageChange,
  onSearchChange
}) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearchChange(searchTerm)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    onSearchChange("")
  }

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      const dateFormatted = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      const timeFormatted = date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
      return `${dateFormatted} at ${timeFormatted}`
    } catch {
      return dateStr
    }
  }

  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <div className="md:min-w-[200px]">
          <CardTitle className="text-base font-sans font-extrabold text-zinc-900 dark:text-zinc-50">User Directory</CardTitle>
          <CardDescription className="text-xs">Manage system operators and registered members.</CardDescription>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-grow justify-center max-w-md mx-auto w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search user or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 py-1.5 w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all text-foreground font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            className="h-8 px-4 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shrink-0"
          >
            Search
          </Button>
        </form>
        <div className="h-8 px-3 text-xs font-bold text-muted-foreground bg-muted border border-zinc-200 dark:border-zinc-800/80 rounded-xl shrink-0 flex items-center justify-center min-w-[100px]">
          Page {usersPage + 1} of {usersTotalPages}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {usersLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <h3 className="text-sm font-semibold">No Members Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {users.map((row) => {
                  const isSelf = currentUser && row.id === currentUser.id
                  return (
                    <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 px-4 font-mono text-muted-foreground">#{row.id}</td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <span>{row.username}</span>
                          {isSelf && (
                            <span className="text-[8px] py-0 px-1 font-semibold rounded bg-muted text-muted-foreground border border-border">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{row.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase ${
                          row.role === "ADMIN" ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"
                        }`}>
                          {row.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{formatDate(row.createdAt)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isSelf || actionLoading}
                          onClick={() => onDeleteUser(row.id, row.username)}
                          className="h-7 w-7 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!usersLoading && usersTotalPages >= 1 && (
          <div className="flex items-center justify-between border-t border-border/40 p-3">
            <span className="text-[10px] text-muted-foreground">
              Page {usersPage + 1} of {usersTotalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={usersPage === 0 || actionLoading}
                onClick={() => onPageChange(usersPage - 1)}
                className="h-7 px-2 text-xs gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={usersPage >= usersTotalPages - 1 || actionLoading}
                onClick={() => onPageChange(usersPage + 1)}
                className="h-7 px-2 text-xs gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
