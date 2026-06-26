import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { useConfirm } from "@/context/ConfirmContext"
import { api } from "@/services/api"

import ProfileDetailsCard from "@/components/profile/ProfileDetailsCard"
import MyArticlesList from "@/components/profile/MyArticlesList"
import EditProfileDialog from "@/components/profile/EditProfileDialog"
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog"

export default function Profile() {
  const { user, token, updateProfileState } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const confirm = useConfirm()
  
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(null)

  // Edit Profile Modal state
  const [editModalOpen, setEditModalOpen] = React.useState(false)

  // Change Password Modal state
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("")
  const [passwordLoading, setPasswordLoading] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState(null)
  const [passwordSuccess, setPasswordSuccess] = React.useState(null)
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = React.useState(false)

  // Profile Form States
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")

  // Authored Blogs States
  const [myBlogs, setMyBlogs] = React.useState([])
  const [blogsLoading, setBlogsLoading] = React.useState(true)
  const [likesCountMap, setLikesCountMap] = React.useState({})

  // Client-side search, category filter, and pagination states
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [myBlogsPage, setMyBlogsPage] = React.useState(0)
  const ITEMS_PER_PAGE = 6

  const fetchMyBlogs = React.useCallback(async () => {
    try {
      setBlogsLoading(true)
      // Fetch all blogs (page size 100 for easy filtering)
      const res = await api.get("/api/blogs?page=0&size=100")
      if (res.data && res.data.content) {
        const filtered = res.data.content.filter((b) => b.author.id === user?.id)
        setMyBlogs(filtered)
        
        // Fetch like count for each blog in parallel
        const likesPromises = filtered.map(async (blog) => {
          try {
            const likeRes = await api.get(`/api/blogs/${blog.id}/likes`)
            return { blogId: blog.id, count: likeRes.data.count }
          } catch (err) {
            console.error(`Failed to fetch likes for blog ${blog.id}:`, err)
            return { blogId: blog.id, count: 0 }
          }
        })
        
        const likesResults = await Promise.all(likesPromises)
        const newLikesMap = {}
        likesResults.forEach((item) => {
          newLikesMap[item.blogId] = item.count
        })
        setLikesCountMap(newLikesMap)
      }
    } catch (err) {
      console.error("Failed to load user blogs:", err)
    } finally {
      setBlogsLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    if (!token || !user) {
      navigate("/auth")
      return
    }

    Promise.resolve().then(() => {
      setUsername(user.username)
      setEmail(user.email)
      fetchMyBlogs()
    })
  }, [user, token, navigate, fetchMyBlogs])

  // Reset page when search or filters change
  React.useEffect(() => {
    Promise.resolve().then(() => {
      setMyBlogsPage(0)
    })
  }, [searchTerm, selectedCategory])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!username.trim() || !email.trim()) {
      setError("Username and email are required")
      toast.error("Username and email are required")
      setLoading(false)
      return
    }

    try {
      const res = await api.put("/api/users/me", { username, email })
      updateProfileState(res.data)
      setSuccess("Profile updated successfully")
      toast.success("Profile updated successfully!")
      
      // Auto close modal after successful update
      setTimeout(() => {
        setEditModalOpen(false)
        setSuccess(null)
      }, 1000)
    } catch (err) {
      setError(err.message || "Failed to update profile")
      toast.error(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)
    setPasswordLoading(true)

    if (!currentPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()) {
      setPasswordError("All fields are required")
      toast.error("All fields are required")
      setPasswordLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      toast.error("New password must be at least 6 characters")
      setPasswordLoading(false)
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match")
      toast.error("New passwords do not match")
      setPasswordLoading(false)
      return
    }

    try {
      await api.put("/api/users/me/change-password", {
        currentPassword,
        newPassword
      })
      setPasswordSuccess("Password updated successfully!")
      toast.success("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmNewPassword(false)

      setTimeout(() => {
        setPasswordModalOpen(false)
        setPasswordSuccess(null)
      }, 1000)
    } catch (err) {
      setPasswordError(err.message || "Failed to update password")
      toast.error(err.message || "Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeletePost = async (id, e) => {
    e.stopPropagation()
    const confirmed = await confirm({
      title: "Delete Blog Post",
      message: "Are you sure you want to delete this blog post?",
      confirmText: "Delete"
    })
    if (!confirmed) return

    try {
      await api.delete(`/api/blogs/${id}`)
      setMyBlogs((prev) => prev.filter((b) => b.id !== id))
      toast.success("Blog post deleted successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to delete post")
    }
  }

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      const dateFormatted = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
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

  // Calculate total views reach
  const totalViews = myBlogs.reduce((acc, b) => acc + (b.viewCount || 0), 0)

  // Calculate total likes reach
  const totalLikes = Object.values(likesCountMap).reduce((acc, count) => acc + count, 0)

  // Extract distinct category tags from user authored blogs
  const myCategories = ["all", ...Array.from(new Set(myBlogs.map((b) => (b.category?.name || "Uncategorized").toLowerCase())))]

  // Client-side search and category filtering
  const filteredBlogs = myBlogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || (blog.category?.name || "Uncategorized").toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Paginated subset computation
  const totalMyBlogsPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE)
  const startIndex = myBlogsPage * ITEMS_PER_PAGE
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (!user) return null

  return (
    <div className="space-y-8 animate-fade-in select-none">
      
      {/* Profile Header */}
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Your Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your platform metrics, credentials, and publish activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* User details left card */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <ProfileDetailsCard
            user={user}
            myBlogsCount={myBlogs.length}
            totalViews={totalViews}
            totalLikes={totalLikes}
            formatDate={formatDate}
            onEditProfile={() => setEditModalOpen(true)}
            onChangePassword={() => setPasswordModalOpen(true)}
          />
        </div>

        {/* Blogs List Column Grid */}
        <div className="lg:col-span-2 space-y-6">
          <MyArticlesList
            blogs={myBlogs}
            blogsLoading={blogsLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            myCategories={myCategories}
            paginatedBlogs={paginatedBlogs}
            filteredBlogsCount={filteredBlogs.length}
            startIndex={startIndex}
            myBlogsPage={myBlogsPage}
            setMyBlogsPage={setMyBlogsPage}
            totalMyBlogsPages={totalMyBlogsPages}
            onDeletePost={handleDeletePost}
            formatDate={formatDate}
            likesCountMap={likesCountMap}
          />
        </div>

      </div>

      {/* Edit Profile Modal Dialog */}
      <EditProfileDialog
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        loading={loading}
        error={error}
        success={success}
        onUpdate={handleUpdateProfile}
      />

      {/* Change Password Modal Dialog */}
      <ChangePasswordDialog
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmNewPassword={confirmNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
        passwordLoading={passwordLoading}
        passwordError={passwordError}
        passwordSuccess={passwordSuccess}
        showCurrentPassword={showCurrentPassword}
        setShowCurrentPassword={setShowCurrentPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        showConfirmNewPassword={showConfirmNewPassword}
        setShowConfirmNewPassword={setShowConfirmNewPassword}
        onChangePassword={handleChangePassword}
      />
    </div>
  )
}
