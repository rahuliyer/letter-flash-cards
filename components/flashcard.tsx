"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  letter: string
  color: string
  word: string
  onCorrect?: () => void
  onWrong?: () => void
  isTouchDevice?: boolean
}

const SWIPE_THRESHOLD = 60

export function Flashcard({ letter, color, word, onCorrect, onWrong, isTouchDevice }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [dragX, setDragX] = useState(0)
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)
  const isDragging = useRef(false)

  const handleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  // Keyboard controls for non-touch devices
  useEffect(() => {
    if (isTouchDevice) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        onCorrect?.()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        onWrong?.()
      } else if (e.key === " ") {
        e.preventDefault()
        handleFlip()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isTouchDevice, onCorrect, onWrong])

  const onDragStart = (clientX: number, clientY: number) => {
    startX.current = clientX
    startY.current = clientY
    isDragging.current = false
  }

  const onDragMove = (clientX: number) => {
    if (startX.current === null) return
    const dx = clientX - startX.current
    isDragging.current = Math.abs(dx) > 5
    if (isDragging.current) {
      setDragX(dx)
    }
  }

  const onDragEnd = (clientX: number) => {
    if (startX.current === null) return
    const dx = clientX - startX.current
    setDragX(0)

    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx > 0) {
        onWrong?.()
      } else {
        onCorrect?.()
      }
    } else if (!isDragging.current) {
      handleFlip()
    }

    startX.current = null
    startY.current = null
    isDragging.current = false
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    onDragStart(e.touches[0].clientX, e.touches[0].clientY)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    onDragMove(e.touches[0].clientX)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    onDragEnd(e.changedTouches[0].clientX)
  }

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    onDragStart(e.clientX, e.clientY)
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (startX.current !== null) {
      onDragMove(e.clientX)
    }
  }
  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX.current !== null) {
      onDragEnd(e.clientX)
    }
  }

  const swipeRatio = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1)
  const isSwipingRight = dragX > 0
  const isSwipingLeft = dragX < 0
  const showHint = Math.abs(dragX) > 20

  return (
    <div
      className="relative w-full aspect-square perspective-1000 cursor-pointer select-none"
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
        transition: dragX === 0 ? "transform 0.3s ease" : "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="button"
      aria-label={`Flashcard for letter ${letter}. ${isFlipped ? `${letter} is for ${word}` : "Tap to flip"}`}
    >
      {/* Swipe hint overlays */}
      {showHint && isSwipingRight && (
        <div
          className="absolute inset-0 z-10 rounded-3xl flex items-center justify-start pl-6 pointer-events-none"
          style={{ backgroundColor: `rgba(239,68,68,${swipeRatio * 0.4})` }}
        >
          <span className="text-red-700 font-bold text-2xl">Try again</span>
        </div>
      )}
      {showHint && isSwipingLeft && (
        <div
          className="absolute inset-0 z-10 rounded-3xl flex items-center justify-end pr-6 pointer-events-none"
          style={{ backgroundColor: `rgba(34,197,94,${swipeRatio * 0.4})` }}
        >
          <span className="text-green-700 font-bold text-2xl">Got it!</span>
        </div>
      )}

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
            "border-4 border-foreground/10"
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
    </div>
  )
}
