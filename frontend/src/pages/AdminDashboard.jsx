import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { useConfirm } from "@/context/ConfirmContext"
import { api } from "@/services/api"
import {
  Users,
  LayoutDashboard,
  BookOpen,
  FolderClosed,
  Tag as TagIcon,
} from "lucide-react"

// Import modular dashboard subcomponents
import AdminOverview from "@/components/admin/AdminOverview"
import AdminUsers from "@/components/admin/AdminUsers"
import AdminBlogs from "@/components/admin/AdminBlogs"
import AdminCategories from "@/components/admin/AdminCategories"
import AdminTags from "@/components/admin/AdminTags"

export default function AdminDashboard() {
  const { user, token } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const confirm = useConfirm()

  const [activeTab, setActiveTab] = React.useState("overview")
  const [actionLoading, setActionLoading] = React.useState(false)

  // Overview stats states
  const [userCount, setUserCount] = React.useState(0)
  const [allBlogs, setAllBlogs] = React.useState([])
  const [allUsers, setAllUsers] = React.useState([])
  const [analyticsLoading, setAnalyticsLoading] = React.useState(false)

  // Users tab states
  const [users, setUsers] = React.useState([])
  const [usersPage, setUsersPage] = React.useState(0)
  const [usersTotalPages, setUsersTotalPages] = React.useState(1)
  const [usersLoading, setUsersLoading] = React.useState(false)
  const [usersSearch, setUsersSearch] = React.useState("")

  // Blogs tab states
  const [blogs, setBlogs] = React.useState([])
  const [blogsPage, setBlogsPage] = React.useState(0)
  const [blogsTotalPages, setBlogsTotalPages] = React.useState(1)
  const [blogsTotalElements, setBlogsTotalElements] = React.useState(0)
  const [blogsLoading, setBlogsLoading] = React.useState(false)
  const [blogsSearch, setBlogsSearch] = React.useState("")

  const handleUsersSearch = (val) => {
    setUsersSearch(val)
    setUsersPage(0)
  }

  const handleBlogsSearch = (val) => {
    setBlogsSearch(val)
    setBlogsPage(0)
  }

  // Category tab states
  const [categories, setCategories] = React.useState([])
  const [categoriesLoading, setCategoriesLoading] = React.useState(false)

  // Tag tab states
  const [tags, setTags] = React.useState([])
  const [tagsLoading, setTagsLoading] = React.useState(false)

  const fetchStats = React.useCallback(async () => {
    try {
      const res = await api.get("/api/users/count")
      setUserCount(res.data.count)
    } catch (err) {
      console.error("Failed to load user count statistics:", err)
    }
  }, [])

  const fetchAnalyticsData = React.useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      const [usersRes, blogsRes] = await Promise.all([
        api.get("/api/users?page=0&size=1000&sortBy=createdAt&direction=desc"),
        api.get("/api/blogs?page=0&size=1000&sortBy=createdAt&direction=desc")
      ])
      if (usersRes.data && usersRes.data.content) {
        setAllUsers(usersRes.data.content)
      }
      if (blogsRes.data && blogsRes.data.content) {
        setAllBlogs(blogsRes.data.content)
      }
    } catch (err) {
      console.error("Failed to load analytics data:", err)
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  const fetchUsers = React.useCallback(async (page, query = "") => {
    try {
      setUsersLoading(true)
      const url = query.trim()
        ? `/api/users/search?keyword=${encodeURIComponent(query.trim())}&page=${page}&size=10&sortBy=createdAt&direction=desc`
        : `/api/users?page=${page}&size=10&sortBy=createdAt&direction=desc`
      const res = await api.get(url)
      if (res.data) {
        setUsers(res.data.content || [])
        setUsersTotalPages(res.data.totalPages || 1)
      }
    } catch (err) {
      toast.error(err.message || "Failed to load user records")
    } finally {
      setUsersLoading(false)
    }
  }, [toast])

  const fetchBlogs = React.useCallback(async (page, query = "") => {
    try {
      setBlogsLoading(true)
      const url = query.trim()
        ? `/api/blogs/search?keyword=${encodeURIComponent(query.trim())}&page=${page}&size=10&sortBy=createdAt&direction=desc`
        : `/api/blogs?page=${page}&size=10&sortBy=createdAt&direction=desc`
      const res = await api.get(url)
      if (res.data) {
        setBlogs(res.data.content || [])
        setBlogsTotalPages(res.data.totalPages || 1)
        setBlogsTotalElements(res.data.totalElements || 0)
      }
    } catch (err) {
      toast.error(err.message || "Failed to load blog records")
    } finally {
      setBlogsLoading(false)
    }
  }, [toast])

  const fetchCategories = React.useCallback(async () => {
    try {
      setCategoriesLoading(true)
      const res = await api.get("/api/categories")
      setCategories(res.data || [])
    } catch (err) {
      console.error("Failed to load categories:", err)
    } finally {
      setCategoriesLoading(false)
    }
  }, [])

  const fetchTags = React.useCallback(async () => {
    try {
      setTagsLoading(true)
      const res = await api.get("/api/tags")
      setTags(res.data || [])
    } catch (err) {
      console.error("Failed to load tags:", err)
    } finally {
      setTagsLoading(false)
    }
  }, [])

  // Authentication validation
  React.useEffect(() => {
    if (!token || !user) {
      navigate("/auth")
      return
    }
    if (user.role !== "ADMIN") {
      toast.error("Access denied: Administrative privileges required.")
      navigate("/")
      return
    }

    Promise.resolve().then(() => {
      fetchStats()
      fetchCategories()
      fetchTags()
      fetchAnalyticsData()
    })
  }, [user, token, navigate, toast, fetchStats, fetchCategories, fetchTags, fetchAnalyticsData])

  // Fetch users when usersPage or usersSearch changes
  React.useEffect(() => {
    if (user?.role === "ADMIN") {
      Promise.resolve().then(() => {
        fetchUsers(usersPage, usersSearch)
      })
    }
  }, [usersPage, user, fetchUsers, usersSearch])

  // Fetch blogs when blogsPage or blogsSearch changes
  React.useEffect(() => {
    if (user?.role === "ADMIN") {
      Promise.resolve().then(() => {
        fetchBlogs(blogsPage, blogsSearch)
      })
    }
  }, [blogsPage, user, fetchBlogs, blogsSearch])

  const handleDeleteUser = async (targetId, targetName) => {
    if (user && targetId === user.id) {
      toast.error("Self-destruction denied: You cannot delete your own account.")
      return
    }

    const confirmed = await confirm({
      title: "Delete User Account",
      message: `CRITICAL WARNING: Are you absolutely sure you want to delete user "${targetName}"? All their authored blog posts will be permanently orphaned or deleted!`,
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      setActionLoading(true)
      await api.delete(`/api/users/${targetId}`)
      toast.success(`User "${targetName}" deleted successfully!`)
      fetchStats()
      if (users.length === 1 && usersPage > 0) {
        setUsersPage((prev) => prev - 1)
      } else {
        fetchUsers(usersPage, usersSearch)
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete user account")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteBlog = async (id, title) => {
    const confirmed = await confirm({
      title: "Delete Blog Post",
      message: `Are you sure you want to delete blog "${title}"? This action cannot be undone.`,
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      setActionLoading(true)
      await api.delete(`/api/blogs/${id}`)
      toast.success("Blog post deleted successfully!")
      fetchBlogs(blogsPage, blogsSearch)
    } catch (err) {
      toast.error(err.message || "Failed to delete blog")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteCategory = async (id, name) => {
    const confirmed = await confirm({
      title: "Delete Category",
      message: `Are you sure you want to delete category "${name}"? This might affect blog posts under it.`,
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      setActionLoading(true)
      await api.delete(`/api/categories/${id}`)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success("Category deleted successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to delete category")
    } finally {
      setActionLoading(false)
    }
  }

  const handleCategorySave = async (mode, id, { name, description }) => {
    setActionLoading(true)
    try {
      if (mode === "create") {
        const res = await api.post("/api/categories", { name, description })
        setCategories((prev) => [...prev, res.data])
        toast.success("Category created successfully!")
      } else if (mode === "edit" && id) {
        const res = await api.put(`/api/categories/${id}`, { name, description })
        setCategories((prev) => prev.map((c) => (c.id === id ? res.data : c)))
        toast.success("Category updated successfully!")
      }
    } catch (err) {
      toast.error(err.message || "Failed to save category.")
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteTag = async (id, name) => {
    const confirmed = await confirm({
      title: "Delete Tag",
      message: `Are you sure you want to delete tag "#${name}"? This might affect blog posts using it.`,
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      setActionLoading(true)
      await api.delete(`/api/tags/${id}`)
      setTags((prev) => prev.filter((t) => t.id !== id))
      toast.success("Tag deleted successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to delete tag")
    } finally {
      setActionLoading(false)
    }
  }

  const handleTagSave = async (mode, id, tagName) => {
    setActionLoading(true)
    try {
      if (mode === "create") {
        const res = await api.post("/api/tags", { name: tagName })
        setTags((prev) => [...prev, res.data])
        toast.success("Tag created successfully!")
      } else if (mode === "edit" && id) {
        const res = await api.put(`/api/tags/${id}`, { name: tagName })
        setTags((prev) => prev.map((t) => (t.id === id ? res.data : t)))
        toast.success("Tag updated successfully!")
      }
    } catch (err) {
      toast.error(err.message || "Failed to save tag.")
      throw err
    } finally {
      setActionLoading(false)
    }
  }

  // Analytics calculations
  const totalViews = React.useMemo(() => {
    return allBlogs.reduce((sum, b) => sum + (b.viewCount || 0), 0)
  }, [allBlogs])

  const avgViews = React.useMemo(() => {
    if (allBlogs.length === 0) return 0
    return (totalViews / allBlogs.length).toFixed(1)
  }, [allBlogs, totalViews])

  const trendData = React.useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
        users: 0,
        blogs: 0
      })
    }
    
    allUsers.forEach(u => {
      if (!u.createdAt) return
      const d = new Date(u.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const match = months.find(m => m.key === key)
      if (match) match.users++
    })
    
    allBlogs.forEach(b => {
      if (!b.createdAt) return
      const d = new Date(b.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const match = months.find(m => m.key === key)
      if (match) match.blogs++
    })
    
    return months
  }, [allUsers, allBlogs])

  const categoryData = React.useMemo(() => {
    const counts = {}
    allBlogs.forEach(blog => {
      const catName = blog.category?.name || "Uncategorized"
      counts[catName] = (counts[counts] || 0) + 1
      counts[catName] = (counts[catName] || 0) + 1
    })
    
    // Fix count duplication from previous copy paste
    const countsFinal = {}
    allBlogs.forEach(blog => {
      const catName = blog.category?.name || "Uncategorized"
      countsFinal[catName] = (countsFinal[catName] || 0) + 1
    })

    return Object.entries(countsFinal)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [allBlogs])

  const topBlogs = React.useMemo(() => {
    return [...allBlogs]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
  }, [allBlogs])

  if (!user || user.role !== "ADMIN") return null

  return (
    <div className="space-y-6 animate-fade-in select-none">
      <div className="border-b border-border/40 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Perform administrative tasks, manage platform user directories, taxonomy, and blog posts.
          </p>
        </div>
        <div className="text-[10px] font-semibold text-muted-foreground bg-muted border border-border px-2.5 py-1 rounded">
          Secured Root Access
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-1 border-b md:border-b-0 md:border-r border-border/65 pb-4 md:pb-0 md:pr-4 overflow-x-auto md:overflow-x-visible scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-secondary text-foreground font-semibold border-l-0 md:border-l-2 md:border-primary rounded-l-none"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "users"
                ? "bg-secondary text-foreground font-semibold border-l-0 md:border-l-2 md:border-primary rounded-l-none"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "blogs"
                ? "bg-secondary text-foreground font-semibold border-l-0 md:border-l-2 md:border-primary rounded-l-none"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Blogs</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "categories"
                ? "bg-secondary text-foreground font-semibold border-l-0 md:border-l-2 md:border-primary rounded-l-none"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <FolderClosed className="h-3.5 w-3.5" />
            <span>Categories</span>
          </button>
          <button
            onClick={() => setActiveTab("tags")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "tags"
                ? "bg-secondary text-foreground font-semibold border-l-0 md:border-l-2 md:border-primary rounded-l-none"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <TagIcon className="h-3.5 w-3.5" />
            <span>Tags</span>
          </button>
        </aside>

        {/* Right Content Panel */}
        <main className="flex-grow min-w-0">
          {activeTab === "overview" && (
            <AdminOverview
              userCount={userCount}
              blogsTotalElements={blogsTotalElements}
              totalViews={totalViews}
              avgViews={avgViews}
              trendData={trendData}
              categoryData={categoryData}
              topBlogs={topBlogs}
              analyticsLoading={analyticsLoading}
            />
          )}
          {activeTab === "users" && (
            <AdminUsers
              users={users}
              usersPage={usersPage}
              usersTotalPages={usersTotalPages}
              usersLoading={usersLoading}
              actionLoading={actionLoading}
              currentUser={user}
              onDeleteUser={handleDeleteUser}
              onPageChange={setUsersPage}
              onSearchChange={handleUsersSearch}
            />
          )}
          {activeTab === "blogs" && (
            <AdminBlogs
              blogs={blogs}
              blogsPage={blogsPage}
              blogsTotalPages={blogsTotalPages}
              blogsLoading={blogsLoading}
              actionLoading={actionLoading}
              onDeleteBlog={handleDeleteBlog}
              onPageChange={setBlogsPage}
              onSearchChange={handleBlogsSearch}
            />
          )}
          {activeTab === "categories" && (
            <AdminCategories
              categories={categories}
              categoriesLoading={categoriesLoading}
              actionLoading={actionLoading}
              onDeleteCategory={handleDeleteCategory}
              onSaveCategory={handleCategorySave}
            />
          )}
          {activeTab === "tags" && (
            <AdminTags
              tags={tags}
              tagsLoading={tagsLoading}
              actionLoading={actionLoading}
              onDeleteTag={handleDeleteTag}
              onSaveTag={handleTagSave}
            />
          )}
        </main>
      </div>
    </div>
  )
}
