import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff } from "lucide-react"
import LogoBug from "@/components/LogoBug"

export default function AuthForm({
  mode,
  toggleMode,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
  onGoogleLogin,
  isModal,
  onForgotPasswordClick,
  onBackToLogin
}) {
  if (mode === "forgot-password") {
    if (isModal) {
      return (
        <div className="w-full flex flex-col gap-4 animate-fade-in select-none">
          <div className="text-center flex flex-col items-center gap-1 pb-2">
            <LogoBug className="h-12 w-12 mb-2" animated={false} />
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Forgot Password
            </h2>
            <p className="text-xs text-muted-foreground text-center">
              Enter your email address to receive an OTP code to reset your password
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
              />
            </div>

            <Button type="submit" className="w-full flex items-center justify-center mt-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 font-bold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <span>Send Reset OTP</span>
              )}
            </Button>

            <div className="text-center text-xs text-muted-foreground w-full mt-2 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-rose-600 font-bold hover:underline"
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
              Forgot password
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Enter your email address to receive a password reset code
            </p>
          </div>

          <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold font-sans">Request Password Reset</CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium font-sans">
                We'll send a 6-digit OTP code to this email to verify your identity.
              </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                    className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full flex items-center justify-center font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Send Reset OTP</span>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground w-full mt-2">
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-rose-600 font-bold hover:underline"
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

  if (isModal) {
    return (
      <div className="w-full flex flex-col gap-4 animate-fade-in select-none">
        <div className="text-center flex flex-col items-center gap-1 pb-2">
          <LogoBug className="h-12 w-12 mb-2" animated={false} />
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {mode === "login" ? "Enter your credentials to enter" : "Fill in the details below to complete your registration"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username (Register only) */}
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
                className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Password</Label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={onForgotPasswordClick}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pr-10 rounded-xl border-zinc-200/80 dark:border-zinc-800"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full flex items-center justify-center mt-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 font-bold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === "login" ? "Sign In" : "Sign Up"}</span>
            )}
          </Button>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <span className="relative px-3 bg-white dark:bg-zinc-950 text-xs uppercase text-zinc-500 font-bold tracking-wider">
              or
            </span>
          </div>

          <Button
            type="button"
            onClick={onGoogleLogin}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 h-10 font-bold"
            disabled={loading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
          
          <div className="text-center text-xs text-muted-foreground w-full mt-2 pt-2 border-t border-border/40">
            <span>{mode === "login" ? "Don't have an account? " : "Already have an account? "}</span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-rose-600 font-bold hover:underline"
              disabled={loading}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-md w-full flex flex-col gap-6 animate-fade-in">
        
        {/* Branding header */}
        <div className="text-center flex flex-col items-center gap-2">
          <LogoBug className="h-14 w-14 mb-2 animate-zoom-in" animated={false} />
          <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-50 font-sans">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {mode === "login" ? "Access your bugblogs publishing space" : "Join the bugblogs sharing community"}
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold font-sans">{mode === "login" ? "Sign In" : "Sign Up"}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-medium">
              {mode === "login"
                ? "Enter your credentials to enter the blog application"
                : "Fill in the details below to complete your registration"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              {/* Username (Register only) */}
              {mode === "register" && (
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a unique author handle"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    autoComplete="username"
                    className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  className="rounded-xl border-zinc-200/80 dark:border-zinc-800"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Password</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={onForgotPasswordClick}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pr-10 rounded-xl border-zinc-200/80 dark:border-zinc-800"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full flex items-center justify-center font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{mode === "login" ? "Sign In" : "Sign Up"}</span>
                )}
              </Button>

              <div className="relative flex items-center justify-center w-full my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <span className="relative px-3 bg-white dark:bg-zinc-950 text-xs uppercase text-zinc-500 font-bold tracking-wider">
                  or
                </span>
              </div>

              <Button
                type="button"
                onClick={onGoogleLogin}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 h-10 font-bold"
                disabled={loading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>
              
              <div className="text-center text-sm text-muted-foreground w-full mt-2">
                <span>{mode === "login" ? "Don't have an account? " : "Already have an account? "}</span>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-rose-600 font-bold hover:underline"
                  disabled={loading}
                >
                  {mode === "login" ? "Sign Up" : "Sign In"}
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
