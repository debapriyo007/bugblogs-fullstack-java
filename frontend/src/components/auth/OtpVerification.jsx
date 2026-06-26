import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import LogoBug from "@/components/LogoBug"

export default function OtpVerification({
  email,
  otp,
  loading,
  resending,
  resendCooldown,
  inputRefs,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onVerify,
  onResend,
  onBack,
  isModal
}) {
  if (isModal) {
    return (
      <div className="w-full flex flex-col gap-4 animate-fade-in select-none">
        <div className="text-center flex flex-col items-center gap-1 pb-2">
          <LogoBug className="h-12 w-12 mb-2" animated={false} />
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground animate-zoom-in">
            Verify Your Email
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs leading-normal">
            We sent a verification code to <span className="font-semibold text-foreground break-all">{email}</span>. Enter the 6-digit code below.
          </p>
        </div>

        <form onSubmit={onVerify} className="space-y-4">
          <div className="flex justify-between gap-1.5 py-2" onPaste={onOtpPaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  if (inputRefs) {
                    inputRefs.current[idx] = el
                  }
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => onOtpChange(idx, e.target.value)}
                onKeyDown={(e) => onOtpKeyDown(idx, e)}
                className="w-10 h-10 text-center text-lg font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-zinc-900 dark:text-zinc-50"
                disabled={loading}
              />
            ))}
          </div>

          <Button type="submit" className="w-full flex items-center justify-center mt-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 font-bold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify OTP</span>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground w-full mt-2 pt-2 border-t border-border/40 flex flex-col gap-2">
            <div>
              {resendCooldown > 0 ? (
                <span>Resend OTP code in <span className="font-semibold text-foreground">{resendCooldown}s</span></span>
              ) : (
                <button
                  type="button"
                  onClick={onResend}
                  className="text-rose-600 font-bold hover:underline"
                  disabled={loading || resending}
                >
                  {resending ? "Sending..." : "Resend OTP Code"}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium hover:underline text-xs"
              disabled={loading}
            >
              Back to credentials
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none animate-fade-in">
      <div className="max-w-md w-full flex flex-col gap-6">
        
        {/* Branding header */}
        <div className="text-center flex flex-col items-center gap-2">
          <LogoBug className="h-14 w-14 mb-2 animate-zoom-in" animated={false} />
          <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-50 font-sans">
            Verify your email
          </h2>
          <p className="text-sm text-muted-foreground font-medium max-w-xs leading-normal mx-auto">
            We sent a verification code to <span className="font-semibold text-zinc-900 dark:text-zinc-50 break-all">{email}</span>
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border border-zinc-200/80 dark:border-zinc-800 shadow-none rounded-3xl bg-white dark:bg-zinc-950 p-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold font-sans">Enter Code</CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Enter the 6-digit OTP code below to verify your email and complete login
            </CardDescription>
          </CardHeader>
          <form onSubmit={onVerify}>
            <CardContent className="space-y-4">
              <div className="flex justify-between gap-2 py-2" onPaste={onOtpPaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      if (inputRefs) {
                        inputRefs.current[idx] = el
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => onOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(idx, e)}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-extrabold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-zinc-900 dark:text-zinc-50"
                    disabled={loading}
                  />
                ))}
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
                      onClick={onResend}
                      className="text-rose-600 font-bold hover:underline"
                      disabled={loading || resending}
                    >
                      {resending ? "Sending..." : "Resend OTP Code"}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onBack}
                  className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium hover:underline text-sm"
                  disabled={loading}
                >
                  Back to credentials
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
