
import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Word } from '@/data/wordData';

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
  showNavigation = true
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
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-sm mx-auto my-4">
      <div className="card-flip-container">
        <div className={cn("card-flip", isFlipped && "flipped")}>
          {/* Front of card (English) */}
          <div 
            className="card-front bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[280px] cursor-pointer"
            onClick={handleCardClick}
          >
            <span className={cn("text-xs px-2 py-1 rounded-full mb-4", getDifficultyColor(word.difficulty))}>
              {word.difficulty}
            </span>
            <h2 className="text-3xl font-bold mb-6">{word.english}</h2>
            <p className="text-gray-600 text-center mb-6 text-sm">{word.example}</p>
            <button 
              className="text-teal-500 hover:text-teal-700 focus:outline-none"
              onClick={playAudio}
            >
              <Volume2 className="h-6 w-6" />
            </button>
            <p className="text-gray-400 text-xs mt-4">点击卡片查看翻译</p>
          </div>

          {/* Back of card (Chinese) */}
          <div 
            className="card-back bg-teal-50 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[280px] cursor-pointer"
            onClick={handleCardClick}
          >
            <h2 className="text-3xl font-bold mb-2">{word.chinese}</h2>
            <p className="text-teal-600 mb-6">{word.pinyin}</p>
            <p className="text-gray-600 text-center mb-6 text-sm">{word.exampleTranslation}</p>
            <p className="text-gray-400 text-xs mt-4">点击卡片返回英文</p>
          </div>
        </div>
      </div>

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
