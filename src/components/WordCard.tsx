import React, { useState } from "react";
import { Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Word } from "@/data/wordData";

interface WordCardProps {
  word: Word;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  onNext,
  onPrevious,
  showNavigation = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implementation would connect to a text-to-speech service
    console.log("Playing audio for:", word.english);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-sm mx-auto my-4">
      {showNavigation && (
        <div className="flex justify-between mt-6">
          <button
            onClick={onPrevious}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-full bg-teal-400 text-white hover:bg-teal-500 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WordCard;
