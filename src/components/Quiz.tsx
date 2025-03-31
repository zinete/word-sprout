
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Word } from '@/data/wordData';
import { toast } from '@/components/ui/use-toast';

interface QuizProps {
  words: Word[];
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ words, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (words.length > 0) {
      generateOptions();
    }
  }, [currentQuestion, words]);

  const generateOptions = () => {
    const currentWord = words[currentQuestion];
    const correctAnswer = currentWord.chinese;
    
    // Get 3 random wrong options from other words
    let wrongOptions = words
      .filter(word => word.id !== currentWord.id)
      .map(word => word.chinese)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine correct and wrong options, then shuffle
    const allOptions = [correctAnswer, ...wrongOptions].sort(() => 0.5 - Math.random());
    
    setOptions(allOptions);
  };

  const handleOptionClick = (option: string) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(option);
    const correctAnswer = words[currentQuestion].chinese;
    const correct = option === correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      toast({
        title: "正确！",
        description: "做得好！",
        variant: "default",
      });
    } else {
      toast({
        title: "错误",
        description: `正确答案: ${correctAnswer}`,
        variant: "destructive",
      });
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < words.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
        onComplete(score + (correct ? 1 : 0));
      }
    }, 1500);
  };

  if (words.length === 0) {
    return <div className="text-center p-4">No words available for quiz</div>;
  }

  if (showResult) {
    const finalScore = score;
    const totalQuestions = words.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">测验结果</h2>
        <div className="text-5xl font-bold mb-4 text-teal-500">{percentage}%</div>
        <p className="text-gray-600 mb-6">
          你答对了 {finalScore} 个问题，共 {totalQuestions} 题
        </p>
        <div className="flex justify-center">
          {percentage >= 70 ? (
            <CheckCircle className="h-16 w-16 text-green-500 animate-bounce-sm" />
          ) : (
            <XCircle className="h-16 w-16 text-orange-500 animate-bounce-sm" />
          )}
        </div>
      </div>
    );
  }

  const currentWord = words[currentQuestion];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>问题 {currentQuestion + 1}/{words.length}</span>
          <span>得分: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-teal-400 to-blue-400 h-2 rounded-full" 
            style={{ width: `${((currentQuestion + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-2">选择正确的中文翻译:</h3>
      <div className="p-4 mb-6 bg-gray-50 rounded-lg">
        <p className="text-2xl font-bold">{currentWord.english}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={selectedAnswer !== null}
            className={cn(
              "p-4 rounded-lg border-2 text-left transition-colors",
              selectedAnswer === null 
                ? "border-gray-200 hover:border-teal-300 hover:bg-teal-50" 
                : selectedAnswer === option 
                  ? isCorrect 
                    ? "border-green-500 bg-green-50" 
                    : "border-red-500 bg-red-50"
                  : option === currentWord.chinese && !isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 opacity-50"
            )}
          >
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
