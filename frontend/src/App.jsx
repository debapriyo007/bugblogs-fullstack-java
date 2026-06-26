import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/context/ThemeContext"
import { ToastProvider } from "@/context/ToastContext"
import { ConfirmProvider } from "@/context/ConfirmContext"
import Layout from "@/components/Layout"
import Home from "@/pages/Home"
import BlogDetail from "@/pages/BlogDetail"
import BlogEditor from "@/pages/BlogEditor"
import Categories from "@/pages/Categories"
import Profile from "@/pages/Profile"
import Auth from "@/pages/Auth"
import AdminDashboard from "@/pages/AdminDashboard"
import About from "@/pages/About"
import OAuth2RedirectHandler from "@/pages/OAuth2RedirectHandler"
import NotFound from "@/pages/NotFound"

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <ConfirmProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="blog/:id" element={<BlogDetail />} />
                  <Route path="editor" element={<BlogEditor />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="oauth2/redirect" element={<OAuth2RedirectHandler />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </ConfirmProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}
