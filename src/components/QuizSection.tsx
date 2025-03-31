
import React, { useState } from 'react';
import { categories } from '@/data/wordData';
import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';

interface QuizSectionProps {
  categoryId: number;
  onQuizComplete: (score: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ 
  categoryId, 
  onQuizComplete 
}) => {
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  const selectedCategory = categories.find(cat => cat.id === categoryId);
  const categoryWords = selectedCategory ? selectedCategory.words : [];
  
  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    onQuizComplete(score);
  };
  
  return (
    <div>
      {quizScore !== null ? (
        <div className="text-center">
          <p className="text-lg mb-4">
            您的得分: <span className="font-bold">{quizScore}/{categoryWords.slice(0, 5).length}</span>
          </p>
          <Button 
            onClick={() => setQuizScore(null)}
            className="mt-4 bg-teal-500 hover:bg-teal-600"
          >
            再次测验
          </Button>
        </div>
      ) : (
        <Quiz 
          words={categoryWords.slice(0, 5)} 
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default QuizSection;
