export default function LogoBug({ className = "h-8 w-8", animated = true, variant = "default", showBackdrop = true }) {
  // Autodetect size/watermark to selectively enable backdrop rendering
  const sizeClass = className.match(/h-(\d+(\.\d+)?)/);
  const heightVal = sizeClass ? parseFloat(sizeClass[1]) : 8;
  const isWatermark = className.includes("opacity-") || className.includes("pointer-events-none");
  const shouldShowBackdrop = showBackdrop && heightVal >= 8 && !isWatermark;

  return (
    <div className={`relative select-none flex items-center justify-center ${className} ${animated ? "bug-animated-wrapper group" : ""}`}>
      <svg
        className="w-full h-full logo-bug-svg"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            @keyframes cursor-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            .terminal-cursor {
              animation: cursor-blink 1s step-end infinite;
            }
            .prompt-path {
              transition: transform 0.2s ease;
            }
            .bug-animated-wrapper.group:hover .prompt-path {
              transform: translateX(3px);
            }
          `}
        </style>

        <defs>
          <linearGradient id="prompt-gradient" x1="15" y1="30" x2="85" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f43f5e" /> {/* Rose 500 */}
            <stop offset="100%" stopColor="#e11d48" /> {/* Rose 600 */}
          </linearGradient>
        </defs>

        {shouldShowBackdrop && (
          <g>
            {/* Minimal backdrop glow */}
            <circle cx="50" cy="50" r="44" fill="#f43f5e" fillOpacity="0.03" />
            <circle cx="50" cy="50" r="44" stroke="#f43f5e" strokeOpacity="0.06" strokeWidth="1" />
          </g>
        )}

        {/* Scaled group for backdrop alignment */}
        <g transform={shouldShowBackdrop ? "translate(50, 50) scale(0.85) translate(-50, -50)" : undefined}>
          {/* Terminal Command Line prompt: >_ */}
          
          {/* ">" Prompt symbol */}
          <path 
            d="M 22 26 L 54 50 L 22 74" 
            stroke="url(#prompt-gradient)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="prompt-path"
          />

          {/* "_" Cursor */}
          <rect 
            x="58" 
            y="64" 
            width="24" 
            height="10" 
            rx="2" 
            fill="currentColor" 
            className="text-zinc-700 dark:text-zinc-300 terminal-cursor" 
          />
        </g>
      </svg>
    </div>
  );
}
