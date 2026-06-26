import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  React.useEffect(() => {
    document.title = "Page Not Found | bugblogs"
  }, [])

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 select-none text-center animate-fade-in max-w-md mx-auto min-h-[70vh] lg:min-h-[85vh]">
      {/* 404 Bug Graphic SVG - Cleared of radar lines, pulsing circles, and center glows */}
      <div className="relative h-48 w-full flex items-center justify-center mb-6">
        <svg
          className="w-48 h-48 drop-shadow-[0_8px_16px_rgba(225,29,72,0.1)]"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>
            {`
              @keyframes float-bug {
                0%, 100% { transform: translateY(0px) rotate(5deg); }
                50% { transform: translateY(-10px) rotate(-10deg); }
              }
              @keyframes float-q {
                0% { transform: translateY(12px) scale(0.7); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateY(-18px) scale(1); opacity: 0; }
              }
              .bug-group {
                animation: float-bug 5s ease-in-out infinite;
                transform-origin: center 100px;
              }
              .q-mark-1 {
                animation: float-q 3.5s ease-in-out infinite;
                transform-origin: 50px 70px;
              }
              .q-mark-2 {
                animation: float-q 4s ease-in-out infinite 1.2s;
                transform-origin: 155px 80px;
              }
              .q-mark-3 {
                animation: float-q 3s ease-in-out infinite 2.2s;
                transform-origin: 140px 50px;
              }
            `}
          </style>

          {/* Floating Question Marks */}
          <g className="q-mark-1" opacity="0">
            <text x="45" y="75" fill="#f43f5e" className="font-extrabold text-xl font-mono">?</text>
          </g>
          <g className="q-mark-2" opacity="0">
            <text x="150" y="85" fill="#fb923c" className="font-extrabold text-lg font-mono">?</text>
          </g>
          <g className="q-mark-3" opacity="0">
            <text x="135" y="55" fill="#f43f5e" className="font-extrabold text-2xl font-mono">?</text>
          </g>

          {/* Lost Bug illustration */}
          <g className="bug-group">
            {/* Back Legs (inverted / lost style) */}
            <path d="M70 85 C60 70, 55 80, 50 75" stroke="currentColor" className="text-zinc-400 dark:text-zinc-600" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M70 100 C55 95, 50 105, 45 102" stroke="currentColor" className="text-zinc-400 dark:text-zinc-600" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M72 115 C58 120, 55 130, 48 128" stroke="currentColor" className="text-zinc-400 dark:text-zinc-600" strokeWidth="3.5" strokeLinecap="round" />

            {/* Front Legs */}
            <path d="M130 85 C140 70, 145 80, 150 75" stroke="currentColor" className="text-zinc-400 dark:text-zinc-600" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M130 100 C145 95, 150 105, 155 102" stroke="currentColor" className="text-zinc-400 dark:text-zinc-600" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M128 115 C142 120, 145 130, 152 128" stroke="currentColor" className="text-zinc-400 dark:text-zinc-600" strokeWidth="3.5" strokeLinecap="round" />

            {/* Antennae */}
            <path d="M92 65 C88 50, 78 45, 75 48" stroke="currentColor" className="text-zinc-500" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M108 65 C112 50, 122 45, 125 48" stroke="currentColor" className="text-zinc-500" strokeWidth="2.5" strokeLinecap="round" />

            {/* Bug Body */}
            <rect x="78" y="70" width="44" height="65" rx="22" fill="currentColor" className="text-zinc-900 dark:text-zinc-800" />
            
            {/* Ladybug Inverted Red Shell Wings */}
            <path d="M80 72 C65 90, 68 125, 84 133 C86 110, 88 88, 80 72 Z" fill="#e11d48" />
            <path d="M120 72 C135 90, 132 125, 116 133 C114 110, 112 88, 120 72 Z" fill="#e11d48" />

            {/* Shell Dots */}
            <circle cx="75" cy="95" r="4.5" fill="#18181b" />
            <circle cx="78" cy="115" r="3.5" fill="#18181b" />
            <circle cx="125" cy="95" r="4.5" fill="#18181b" />
            <circle cx="122" cy="115" r="3.5" fill="#18181b" />

            {/* Bug Head */}
            <circle cx="100" cy="68" r="16" fill="currentColor" className="text-zinc-950 dark:text-zinc-900" />

            {/* Confused Eyes */}
            <path d="M92 64 L96 68 M96 64 L92 68" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M104 64 L108 68 M108 64 L104 68" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
        
        <div className="absolute bottom-0 text-[10px] uppercase font-bold tracking-[0.3em] bg-rose-500/10 text-rose-500 px-3.5 py-1 rounded-full border border-rose-500/20 backdrop-blur-sm">
          Bug Found: Error 404
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-7xl sm:text-8xl font-black tracking-tighter bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent mb-3">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
        Oops! This path has a bug.
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for doesn't exist or has crawled away. Let's get you back to safety.
      </p>

      {/* CTA Recovery Actions */}
      <div className="flex items-center justify-center">
        <Button
          onClick={() => navigate(-1)}
          className="h-10 px-6 rounded-full bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-zinc-900 dark:hover:bg-zinc-200 shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </Button>
      </div>
    </div>
  )
}

