"use client"

import { useState, useCallback } from "react"
import { Flashcard } from "@/components/flashcard"
import { Button } from "@/components/ui/button"
import { Shuffle, RotateCcw, PartyPopper } from "lucide-react"

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
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const currentCard = cards[currentIndex]
  const remainingCards = cards.length - currentIndex

  const handleCorrect = useCallback(() => {
    setCorrectCount((prev) => prev + 1)
    
    if (currentIndex >= cards.length - 1) {
      setIsComplete(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setCardKey((prev) => prev + 1)
    }
  }, [currentIndex, cards.length])

  const handleWrong = useCallback(() => {
    setWrongCount((prev) => prev + 1)
    
    setCards((prevCards) => {
      const newCards = [...prevCards]
      const [wrongCard] = newCards.splice(currentIndex, 1)
      newCards.push(wrongCard)
      return newCards
    })
    
    if (currentIndex >= cards.length - 1) {
      setCurrentIndex(cards.length - 1)
    }
    setCardKey((prev) => prev + 1)
  }, [currentIndex, cards.length])

  const shuffleCards = useCallback(() => {
    const shuffled = [...alphabet].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setCardKey((prev) => prev + 1)
    setCorrectCount(0)
    setWrongCount(0)
    setIsComplete(false)
  }, [])

  const resetCards = useCallback(() => {
    setCards(alphabet)
    setCurrentIndex(0)
    setCardKey((prev) => prev + 1)
    setCorrectCount(0)
    setWrongCount(0)
    setIsComplete(false)
  }, [])

  if (isComplete) {
    return (
      <main className="min-h-svh flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center space-y-6">
          <PartyPopper className="w-24 h-24 mx-auto text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Great Job!
          </h1>
          <p className="text-xl text-muted-foreground">
            You finished all the letters!
          </p>
          <div className="flex justify-center gap-8 text-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{wrongCount}</div>
              <div className="text-muted-foreground">Missed</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={resetCards}
              className="h-14 px-8 rounded-full text-lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Play Again
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={shuffleCards}
              className="h-14 px-8 rounded-full text-lg"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-svh flex flex-col bg-background">
      {/* Header */}
      <header className="py-4 px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          ABC Flashcards
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Tap to flip, swipe to answer
        </p>
      </header>

      {/* Progress and stats */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-lg">{correctCount}</span>
            <span className="text-muted-foreground text-sm">correct</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {remainingCards} left
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-lg">{wrongCount}</span>
            <span className="text-muted-foreground text-sm">missed</span>
          </div>
        </div>
        <div className="w-full max-w-md mx-auto mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(correctCount / 26) * 100}%` }}
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
            onCorrect={handleCorrect}
            onWrong={handleWrong}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 pb-8">
        <div className="flex items-center justify-center gap-4">
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
            <span className="text-lg">Reset</span>
          </Button>
        </div>
      </div>
    </main>
  )
}
