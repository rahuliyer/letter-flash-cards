"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  letter: string
  color: string
  word: string
  onFlip?: () => void
}

export function Flashcard({ letter, color, word, onFlip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    onFlip?.()
  }

  return (
    <button
      onClick={handleFlip}
      className="w-full aspect-square perspective-1000 cursor-pointer group"
      aria-label={`Flashcard for letter ${letter}. ${isFlipped ? `${letter} is for ${word}` : "Tap to flip"}`}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front of card - Letter */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-3xl flex items-center justify-center shadow-xl",
            "border-4 border-foreground/10",
            "active:scale-95 transition-transform"
          )}
          style={{ backgroundColor: color }}
        >
          <span className="text-[min(40vw,180px)] font-bold text-foreground select-none leading-none">
            {letter}
          </span>
        </div>

        {/* Back of card - Word */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-3xl flex flex-col items-center justify-center shadow-xl rotate-y-180",
            "border-4 border-foreground/10 p-4"
          )}
          style={{ backgroundColor: color }}
        >
          <span className="text-[min(20vw,90px)] font-bold text-foreground leading-none mb-2">
            {letter}
          </span>
          <span className="text-[min(8vw,36px)] font-semibold text-foreground/80 text-center">
            is for
          </span>
          <span className="text-[min(10vw,48px)] font-bold text-foreground text-center leading-tight">
            {word}
          </span>
        </div>
      </div>
    </button>
  )
}
