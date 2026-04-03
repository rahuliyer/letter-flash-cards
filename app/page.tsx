"use client"

import { useState, useCallback } from "react"
import { Flashcard } from "@/components/flashcard"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw } from "lucide-react"

const alphabet = [
  { letter: "a", word: "Apple", color: "#FF6B6B" },
  { letter: "b", word: "Ball", color: "#4ECDC4" },
  { letter: "c", word: "Cat", color: "#FFE66D" },
  { letter: "d", word: "Dog", color: "#95E1D3" },
  { letter: "e", word: "Elephant", color: "#F38181" },
  { letter: "f", word: "Fish", color: "#7FDBDA" },
  { letter: "g", word: "Grapes", color: "#C9B1FF" },
  { letter: "h", word: "Hat", color: "#FFEAA7" },
  { letter: "i", word: "Ice cream", color: "#FD79A8" },
  { letter: "j", word: "Juice", color: "#74B9FF" },
  { letter: "k", word: "Kite", color: "#A8E6CF" },
  { letter: "l", word: "Lion", color: "#FFD93D" },
  { letter: "m", word: "Moon", color: "#6C5CE7" },
  { letter: "n", word: "Nest", color: "#81ECEC" },
  { letter: "o", word: "Orange", color: "#FAB1A0" },
  { letter: "p", word: "Pig", color: "#FDA7DF" },
  { letter: "q", word: "Queen", color: "#B8E994" },
  { letter: "r", word: "Rainbow", color: "#FF7675" },
  { letter: "s", word: "Sun", color: "#FDCB6E" },
  { letter: "t", word: "Tree", color: "#00B894" },
  { letter: "u", word: "Umbrella", color: "#E17055" },
  { letter: "v", word: "Van", color: "#00CEC9" },
  { letter: "w", word: "Whale", color: "#6C5CE7" },
  { letter: "x", word: "X-ray", color: "#FD79A8" },
  { letter: "y", word: "Yo-yo", color: "#FFEAA7" },
  { letter: "z", word: "Zebra", color: "#55A3FF" },
]

export default function FlashcardsPage() {
  const [cards, setCards] = useState(alphabet)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardKey, setCardKey] = useState(0)

  const currentCard = cards[currentIndex]

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
    setCardKey((prev) => prev + 1)
  }, [cards.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    setCardKey((prev) => prev + 1)
  }, [cards.length])

  const shuffleCards = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setCardKey((prev) => prev + 1)
  }, [cards])

  const resetCards = useCallback(() => {
    setCards(alphabet)
    setCurrentIndex(0)
    setCardKey((prev) => prev + 1)
  }, [])

  return (
    <main className="min-h-svh flex flex-col bg-background">
      {/* Header */}
      <header className="py-4 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          ABC Flashcards
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Tap the card to flip it!
        </p>
      </header>

      {/* Progress indicator */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            {currentIndex + 1}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg text-muted-foreground">{cards.length}</span>
        </div>
        <div className="w-full max-w-md mx-auto mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard area */}
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-sm">
          <Flashcard
            key={cardKey}
            letter={currentCard.letter}
            color={currentCard.color}
            word={currentCard.word}
          />
        </div>
      </div>

      {/* Navigation controls */}
      <div className="p-4 space-y-4 pb-8">
        {/* Main navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={goToPrevious}
            className="h-14 w-14 rounded-full p-0"
            aria-label="Previous letter"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={shuffleCards}
              className="h-14 px-6 rounded-full"
              aria-label="Shuffle cards"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              <span className="text-lg">Shuffle</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={resetCards}
              className="h-14 px-6 rounded-full"
              aria-label="Reset to A-Z"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              <span className="text-lg">A-Z</span>
            </Button>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={goToNext}
            className="h-14 w-14 rounded-full p-0"
            aria-label="Next letter"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Letter quick jump */}
        <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
          {cards.map((card, index) => (
            <button
              key={card.letter}
              onClick={() => {
                setCurrentIndex(index)
                setCardKey((prev) => prev + 1)
              }}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                index === currentIndex
                  ? "bg-primary text-primary-foreground scale-110"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-label={`Go to letter ${card.letter}`}
            >
              {card.letter}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
