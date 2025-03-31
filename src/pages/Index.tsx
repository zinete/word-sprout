
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { categories } from '@/data/wordData';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { markWordAsLearned, getUserProgress } from '@/utils/userProgress';
import { useToast } from '@/hooks/use-toast';
import CategoryList from '@/components/CategoryList';
import WordLearningSection from '@/components/WordLearningSection';
import QuizSection from '@/components/QuizSection';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const { toast } = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('learn');
  const [studiedWords, setStudiedWords] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserId(session.user.id);
        
        // Load user progress
        try {
          const userProgress = await getUserProgress(session.user.id);
          if (userProgress) {
            // Extract all learned word IDs
            const allStudiedWordIds: number[] = [];
            userProgress.categories.forEach(category => {
              category.wordsProgress.forEach(word => {
                if (word.learned) {
                  allStudiedWordIds.push(word.wordId);
                }
              });
            });
            setStudiedWords(allStudiedWordIds);
          }
        } catch (error) {
          console.error("Error loading user progress:", error);
        }
      }
    };
    
    checkUserSession();
  }, []);
  
  const selectedCategory = selectedCategoryId 
    ? categories.find(cat => cat.id === selectedCategoryId) 
    : null;
  
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setActiveTab('learn');
  };
  
  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
  };
  
  const handleMarkWordAsLearned = async (wordId: number) => {
    if (!studiedWords.includes(wordId)) {
      setStudiedWords(prev => [...prev, wordId]);
      
      // If user is logged in, save learning progress
      if (isLoggedIn && userId && selectedCategoryId && selectedCategory) {
        try {
          await markWordAsLearned(
            userId, 
            selectedCategoryId, 
            wordId,
            selectedCategory.name
          );
        } catch (error) {
          console.error("Error saving word progress:", error);
        }
      }
    }
  };
  
  const handleQuizComplete = (score: number) => {
    // Record quiz result if user is logged in
    if (isLoggedIn) {
      toast({
        title: "测验完成",
        description: `您的得分: ${score}/${selectedCategory?.words.slice(0, 5).length || 5}`,
      });
    }
  };
  
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
                <WordLearningSection 
                  categoryId={selectedCategoryId}
                  studiedWords={studiedWords}
                  onMarkWordAsLearned={handleMarkWordAsLearned}
                  onSwitchToQuiz={() => setActiveTab('quiz')}
                />
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-4">
                <QuizSection 
                  categoryId={selectedCategoryId}
                  onQuizComplete={handleQuizComplete} 
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <CategoryList 
            studiedWords={studiedWords}
            onCategorySelect={handleCategorySelect}
          />
        )}
      </main>
      
      <Navbar />
    </div>
  );
};

export default Index;
