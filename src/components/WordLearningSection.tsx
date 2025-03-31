
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { categories } from '@/data/wordData';
import WordCard from '@/components/WordCard';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';

interface WordLearningSectionProps {
  categoryId: number;
  studiedWords: number[];
  onMarkWordAsLearned: (wordId: number) => void;
  onSwitchToQuiz: () => void;
}

const WordLearningSection: React.FC<WordLearningSectionProps> = ({
  categoryId,
  studiedWords,
  onMarkWordAsLearned,
  onSwitchToQuiz
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const selectedCategory = categories.find(cat => cat.id === categoryId);
  const categoryWords = selectedCategory ? selectedCategory.words : [];
  
  const handleNextWord = () => {
    if (currentWordIndex < categoryWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      onMarkWordAsLearned(categoryWords[currentWordIndex].id);
    }
  };
  
  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };
  
  // Calculate progress
  const calculateProgress = () => {
    if (!selectedCategory) return { current: 0, total: 0 };
    
    const categoryWordIds = selectedCategory.words.map(word => word.id);
    const studiedWordsInCategory = studiedWords.filter(id => 
      categoryWordIds.includes(id)
    );
    
    return {
      current: studiedWordsInCategory.length,
      total: selectedCategory.words.length
    };
  };
  
  const progress = calculateProgress();
  
  return (
    <div>
      <ProgressBar 
        current={progress.current} 
        total={progress.total}
        className="mb-4" 
      />
      
      {categoryWords.length > 0 && (
        <WordCard 
          word={categoryWords[currentWordIndex]}
          onNext={handleNextWord}
          onPrevious={handlePreviousWord}
        />
      )}
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={onSwitchToQuiz}
          className="bg-teal-500 hover:bg-teal-600"
        >
          <Play className="h-4 w-4 mr-2" />
          开始测验
        </Button>
      </div>
    </div>
  );
};

export default WordLearningSection;
