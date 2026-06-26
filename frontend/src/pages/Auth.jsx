import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { api } from "@/services/api"

import OtpVerification from "@/components/auth/OtpVerification"
import AuthForm from "@/components/auth/AuthForm"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff } from "lucide-react"
import LogoBug from "@/components/LogoBug"

export default function Auth({ isModal = false, onClose, initialMode = "login" }) {
  const { login, register, verifyOtp, token } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = React.useState(initialMode)
  const [loading, setLoading] = React.useState(false)

  // Form Fields
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  // Reset Password Fields
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [verifiedOtp, setVerifiedOtp] = React.useState("")

  // OTP Verification States & Refs
  const [verificationStep, setVerificationStep] = React.useState(false)
  const [verificationEmail, setVerificationEmail] = React.useState("")
  const [otp, setOtp] = React.useState(Array(6).fill(""))
  const [resendCooldown, setResendCooldown] = React.useState(0)
  const [resending, setResending] = React.useState(false)
  const inputRefs = React.useRef([])

  React.useEffect(() => {
    // If already logged in, handle callback or redirect
    if (token) {
      if (isModal) {
        onClose?.()
      } else {
        navigate("/")
      }
    }
  }, [token, navigate, isModal, onClose])

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get("error")
    if (err) {
      toast.error(decodeURIComponent(err))
      // Clean up URL so the query parameter doesn't linger in address bar
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [toast])

  React.useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  React.useEffect(() => {
    if (verificationStep) {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [verificationStep])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        if (!email || !password) throw new Error("Please fill in all fields")
        await login(email, password)
        toast.success("Login successful!")
        if (isModal) {
          onClose?.()
        } else {
          navigate("/")
        }
      } else if (mode === "forgot-password") {
        if (!email) throw new Error("Please enter your email address")
        await api.post("/api/auth/forgot-password", { email })
        toast.success("A 6-digit reset code has been sent to your email.")
        setVerificationEmail(email)
        setOtp(Array(6).fill(""))
        setVerifiedOtp("")
        setNewPassword("")
        setConfirmPassword("")
        setMode("forgot-password-otp")
      } else {
        if (!username || !email || !password) throw new Error("Please fill in all fields")
        if (username.length < 3) throw new Error("Username must be at least 3 characters")
        if (password.length < 6) throw new Error("Password must be at least 6 characters")
        
        await register(username, email, password)
        toast.success("Registration successful! A 6-digit verification code has been sent to your email.")
        setVerificationEmail(email)
        setVerificationStep(true)
      }
    } catch (err) {
      if (err.status === 403) {
        setVerificationEmail(email)
        setVerificationStep(true)
        toast.warning(err.message || "Account not verified. Please enter the OTP code sent to your email.")
      } else {
        toast.error(err.message || "An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()
    if (!/^\d{6}$/.test(pastedData)) return

    const newOtp = pastedData.split("")
    setOtp(newOtp)
    inputRefs.current[5]?.focus()
  }

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault()
    const code = otp.join("")
    if (code.length < 6) {
      toast.error("Please enter all 6 digits of the verification code")
      return
    }

    setLoading(true)
    try {
      await verifyOtp(verificationEmail, code)
      toast.success("Verification successful! You are now signed in.")
      if (isModal) {
        onClose?.()
      } else {
        navigate("/")
      }
    } catch (err) {
      toast.error(err.message || "Invalid or expired OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyResetOtp = async (e) => {
    if (e) e.preventDefault()
    const code = otp.join("")
    if (code.length < 6) {
      toast.error("Please enter all 6 digits of the reset code")
      return
    }

    setLoading(true)
    try {
      await api.post("/api/auth/verify-reset-otp", {
        email: verificationEmail,
        otp: code
      })
      toast.success("OTP verified successfully! You can now choose a new password.")
      setVerifiedOtp(code)
      setMode("reset-password")
    } catch (err) {
      toast.error(err.message || "Invalid or expired OTP code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await api.post("/api/auth/reset-password", {
        email: verificationEmail,
        otp: verifiedOtp,
        newPassword
      })
      toast.success("Password reset successful! You can now sign in.")
      setOtp(Array(6).fill(""))
      setVerifiedOtp("")
      setNewPassword("")
      setConfirmPassword("")
      setMode("login")
    } catch (err) {
      toast.error(err.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return
    setResending(true)
    try {
      if (mode === "forgot-password-otp") {
        await api.post("/api/auth/forgot-password", { email: verificationEmail })
        toast.success("A new password reset code has been sent to your email.")
      } else {
        await api.post(`/api/auth/resend-otp?email=${encodeURIComponent(verificationEmail)}`)
        toast.success("A new verification code has been dispatched to your email.")
      }
      setResendCooldown(60)
      setOtp(Array(6).fill(""))
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 50)
    } catch (err) {
      toast.error(err.message || "Failed to resend code. Please try again.")
    } finally {
      setResending(false)
    }
  }

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"))
    setUsername("")
    setEmail("")
    setPassword("")
  }

  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
    window.location.href = `${baseUrl}/oauth2/authorization/google`
  }

  if (verificationStep) {
    return (
      <OtpVerification
        email={verificationEmail}
        otp={otp}
        loading={loading}
        resending={resending}
        resendCooldown={resendCooldown}
        inputRefs={inputRefs}
        onOtpChange={handleOtpChange}
        onOtpKeyDown={handleOtpKeyDown}
        onOtpPaste={handleOtpPaste}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={() => {
          setVerificationStep(false)
          setOtp(Array(6).fill(""))
        }}
        isModal={isModal}
      />
    )
  }

  if (mode === "forgot-password-otp") {
    if (isModal) {
      return (
        <div className="w-full flex flex-col gap-4 animate-fade-in select-none">
          <div className="text-center flex flex-col items-center gap-1 pb-2">
            <LogoBug className="h-12 w-12 mb-2" animated={false} />
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Verify OTP
            </h2>
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit OTP code sent to <span className="font-semibold text-foreground break-all">{verificationEmail}</span>
            </p>
          </div>

          <form onSubmit={handleVerifyResetOtp} className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Verification Code</Label>
              <div className="flex justify-between gap-1.5 py-1" onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-10 text-center text-lg font-bold rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-zinc-900 dark:text-zinc-50"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full flex items-center justify-center mt-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 font-bold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Code</span>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground w-full mt-2 pt-2 border-t border-border/40 flex flex-col gap-2">
              <div>
                {resendCooldown > 0 ? (
                  <span>Resend OTP code in <span className="font-semibold text-foreground">{resendCooldown}s</span></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-rose-600 font-bold hover:underline"
                    disabled={loading || resending}
                  >
                    {resending ? "Sending..." : "Resend OTP Code"}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode("login")
                  setOtp(Array(6).fill(""))
                }}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium hover:underline text-xs"
                disabled={loading}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      )
    }

    return (
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none animate-fade-in">
        <div className="max-w-md w-full flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <LogoBug className="h-14 w-14 mb-2 animate-zoom-in" animated={false} />
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-50 font-sans">
              Verify OTP
            </h2>
            <p className="text-sm text-muted-foreground font-medium text-center">
              We sent a password reset code to <span className="font-semibold text-zinc-900 dark:text-zinc-50 break-all">{verificationEmail}</span>
            </p>
          </div>

          <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold font-sans">Enter Code</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium font-sans">
                Verify the 6-digit OTP code below to continue.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleVerifyResetOtp}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Verification Code</Label>
                  <div className="flex justify-between gap-2 py-1" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-extrabold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-zinc-900 dark:text-zinc-50"
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full flex items-center justify-center font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground w-full flex flex-col gap-3 mt-1">
                  <div>
                    {resendCooldown > 0 ? (
                      <span>Resend OTP code in <span className="font-semibold text-zinc-900 dark:text-zinc-50">{resendCooldown}s</span></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-rose-600 font-bold hover:underline"
                        disabled={loading || resending}
                      >
                        {resending ? "Sending..." : "Resend OTP Code"}
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login")
                      setOtp(Array(6).fill(""))
                    }}
                    className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium hover:underline text-sm"
                    disabled={loading}
                  >
                    Back to Sign In
                  </button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  if (mode === "reset-password") {
    if (isModal) {
      return (
        <div className="w-full flex flex-col gap-4 animate-fade-in select-none">
          <div className="text-center flex flex-col items-center gap-1 pb-2">
            <LogoBug className="h-12 w-12 mb-2" animated={false} />
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Choose New Password
            </h2>
            <p className="text-xs text-muted-foreground text-center">
              Set a new secure password for your account <span className="font-semibold text-foreground break-all">{verificationEmail}</span>
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10 rounded-xl border-zinc-200/80 dark:border-zinc-800"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  disabled={loading}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10 rounded-xl border-zinc-200/80 dark:border-zinc-800"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full flex items-center justify-center mt-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 font-bold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground w-full mt-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => {
                  setMode("login")
                  setOtp(Array(6).fill(""))
                  setVerifiedOtp("")
                  setNewPassword("")
                  setConfirmPassword("")
                }}
                className="text-rose-600 font-bold hover:underline"
                disabled={loading}
              >
                Cancel and Sign In
              </button>
            </div>
          </form>
        </div>
      )
    }

    return (
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none animate-fade-in">
        <div className="max-w-md w-full flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <LogoBug className="h-14 w-14 mb-2 animate-zoom-in" animated={false} />
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-50 font-sans">
              Choose New Password
            </h2>
            <p className="text-sm text-muted-foreground font-medium text-center">
              Set a new secure password for <span className="font-semibold text-zinc-900 dark:text-zinc-50 break-all">{verificationEmail}</span>
            </p>
          </div>

          <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold font-sans">Enter New Password</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium font-sans">
                Choose a password of at least 6 characters.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                      className="pr-10 rounded-xl border-zinc-200/80 dark:border-zinc-800"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      disabled={loading}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="pr-10 rounded-xl border-zinc-200/80 dark:border-zinc-800"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full flex items-center justify-center font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground w-full mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login")
                      setOtp(Array(6).fill(""))
                      setVerifiedOtp("")
                      setNewPassword("")
                      setConfirmPassword("")
                    }}
                    className="text-rose-600 font-bold hover:underline text-sm"
                    disabled={loading}
                  >
                    Cancel and Sign In
                  </button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <AuthForm
      mode={mode}
      toggleMode={toggleMode}
      username={username}
      setUsername={setUsername}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      loading={loading}
      onSubmit={handleSubmit}
      onGoogleLogin={handleGoogleLogin}
      isModal={isModal}
      onForgotPasswordClick={() => {
        setMode("forgot-password")
        setEmail("")
      }}
      onBackToLogin={() => {
        setMode("login")
        setEmail("")
      }}
    />
  )
}
