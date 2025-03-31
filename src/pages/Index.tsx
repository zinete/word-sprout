
import React, { useState } from 'react';
import { ChevronRight, Play, BarChart } from 'lucide-react';
import { categories, getWordsByCategory } from '@/data/wordData';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import WordCard from '@/components/WordCard';
import ProgressBar from '@/components/ProgressBar';
import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('learn');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [studiedWords, setStudiedWords] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  const selectedCategory = selectedCategoryId 
    ? categories.find(cat => cat.id === selectedCategoryId) 
    : null;
  
  const categoryWords = selectedCategory ? selectedCategory.words : [];
  
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setCurrentWordIndex(0);
    setActiveTab('learn');
  };
  
  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setQuizScore(null);
  };
  
  const handleNextWord = () => {
    if (currentWordIndex < categoryWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      
      // Mark word as studied
      if (!studiedWords.includes(categoryWords[currentWordIndex].id)) {
        setStudiedWords([...studiedWords, categoryWords[currentWordIndex].id]);
      }
    }
  };
  
  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };
  
  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
  };
  
  // Calculate progress for the selected category
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        {selectedCategoryId ? (
          <div className="flex items-center">
            <button 
              onClick={handleBackToCategories}
              className="mr-2 text-gray-500"
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
            </button>
            <h1 className="text-xl font-bold">{selectedCategory?.name}</h1>
          </div>
        ) : (
          <h1 className="text-xl font-bold">单词学习</h1>
        )}
      </header>
      
      <main className="container max-w-md mx-auto p-4">
        {selectedCategoryId ? (
          <div>
            <ProgressBar 
              current={progress.current} 
              total={progress.total}
              className="mb-4" 
            />
            
            <Tabs 
              defaultValue="learn" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="learn">学习</TabsTrigger>
                <TabsTrigger value="quiz">测验</TabsTrigger>
              </TabsList>
              
              <TabsContent value="learn" className="mt-4">
                {categoryWords.length > 0 && (
                  <WordCard 
                    word={categoryWords[currentWordIndex]}
                    onNext={handleNextWord}
                    onPrevious={handlePreviousWord}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-4">
                {quizScore !== null ? (
                  <div className="text-center">
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
              </TabsContent>
            </Tabs>
            
            {activeTab === 'learn' && (
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={() => setActiveTab('quiz')}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  开始测验
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl p-5 text-white mb-6">
              <h2 className="text-xl font-bold mb-2">欢迎使用单词学习！</h2>
              <p className="mb-4 opacity-90">选择一个类别开始学习新单词</p>
              <div className="flex items-center bg-white/20 rounded-lg p-3">
                <BarChart className="h-10 w-10 mr-3 text-white" />
                <div>
                  <p className="font-medium">已学习单词</p>
                  <p className="text-2xl font-bold">{studiedWords.length}</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-lg font-medium mb-3">学习类别</h2>
            <div className="grid gap-4">
              {categories.map(category => (
                <CategoryCard 
                  key={category.id}
                  category={category}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default Index;
