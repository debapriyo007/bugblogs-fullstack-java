import * as React from "react"

const WORDS = ["bugblogs.", "tech insights.", "dev stories.", "creative columns."]

const TypingHeader = () => {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0)
  const [currentText, setCurrentText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [typingSpeed, setTypingSpeed] = React.useState(150)

  React.useEffect(() => {
    let timer
    const handleType = () => {
      const fullWord = WORDS[currentWordIndex]
      if (!isDeleting) {
        // Typing
        setCurrentText(fullWord.substring(0, currentText.length + 1))
        setTypingSpeed(150)

        if (currentText === fullWord) {
          // Pause before deleting
          timer = setTimeout(() => setIsDeleting(true), 2500)
          return
        }
      } else {
        // Deleting
        setCurrentText(fullWord.substring(0, currentText.length - 1))
        setTypingSpeed(80)

        if (currentText === "") {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % WORDS.length)
          setTypingSpeed(600) // Pause before starting typing again
          return
        }
      }
    }

    timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentWordIndex, typingSpeed])

  const isFullyTyped = currentText === WORDS[currentWordIndex]

  return (
    <span className="relative inline-block select-none pb-2">
      <span className="text-zinc-900 dark:text-zinc-50 font-bold transition-colors">
        {currentText.replace(/\.$/, "")}
        {currentText.endsWith(".") && <span className="text-rose-600 font-bold">.</span>}
      </span>
      <span className="typing-cursor text-rose-600 font-normal">|</span>
      
      {/* Crazy Underline SVG */}
      <svg
        className={`absolute -bottom-1 left-0 w-full h-3 text-rose-500 pointer-events-none overflow-visible transition-opacity duration-300 ${isFullyTyped ? "opacity-100" : "opacity-0"}`}
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
      >
        <path
          d="M2,8 C40,2 80,12 120,6 C160,0 180,10 198,4"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isFullyTyped ? "crazy-line-draw" : ""}
        />
      </svg>
    </span>
  )
}

export default function HeroHeader() {
  return (
    <div className="text-center max-w-2xl mx-auto space-y-3 px-4">
      <p
        className="text-rose-500 font-semibold tracking-widest uppercase"
        style={{ fontFamily: "'Caveat', cursive", fontSize: "1.15rem", letterSpacing: "0.12em" }}
      >
        "welcome to"
      </p>
      <h1
        className="text-5xl sm:text-6xl font-bold leading-tight"
        style={{ fontFamily: "'Caveat', cursive" }}
      >
        <TypingHeader />
      </h1>
      <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-lg mx-auto">
        A curated space for tech wisdom, creative writing &amp; developer insights.
        Read, write, and discover stories that matter.
      </p>
    </div>
  )
}
