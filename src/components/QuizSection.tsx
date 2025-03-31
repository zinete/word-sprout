
import React, { useState, useEffect } from 'react';
import { categories } from '@/data/wordData';
import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { markWordAsLearned } from '@/utils/userProgress';

interface QuizSectionProps {
  categoryId: number;
  onQuizComplete: (score: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ 
  categoryId, 
  onQuizComplete 
}) => {
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const { user } = useAuth();
  
  const selectedCategory = categories.find(cat => cat.id === categoryId);
  const categoryWords = selectedCategory ? selectedCategory.words : [];
  
  const handleQuizComplete = async (score: number) => {
    setQuizScore(score);
    onQuizComplete(score);

    // If user is logged in, record successful answers
    if (user && selectedCategory && score > 0) {
      try {
        // Mark words as learned based on correct answers
        // This is a simplified approach - in a real app you would track which specific words were answered correctly
        const wordsToMark = Math.min(score, categoryWords.length);
        
        for (let i = 0; i < wordsToMark; i++) {
          const word = categoryWords[i];
          await markWordAsLearned(
            user.id,
            categoryId,
            word.id,
            selectedCategory.name
          );
        }
        
        toast({
          title: "进度已更新",
          description: `已将 ${score} 个单词标记为已学习`,
        });
      } catch (error) {
        console.error("Error saving quiz progress:", error);
        toast({
          variant: "destructive",
          title: "保存进度失败",
          description: "无法更新学习进度，请稍后再试",
        });
      }
    }
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
