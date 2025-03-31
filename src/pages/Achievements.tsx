
import React, { useEffect, useState } from 'react';
import { Award, BookOpen, Calendar, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

const Achievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  useEffect(() => {
    if (user) {
      // 根据用户进度生成成就列表
      const userAchievements: Achievement[] = [
        {
          id: 1,
          title: "初学者",
          description: "学习了第一个单词",
          icon: <BookOpen className="h-8 w-8 text-teal-500" />,
          unlocked: user.totalWords >= 1,
          progress: Math.min(user.totalWords, 1),
          target: 1
        },
        {
          id: 2,
          title: "单词收藏家",
          description: "学习了10个单词",
          icon: <BookOpen className="h-8 w-8 text-teal-500" />,
          unlocked: user.totalWords >= 10,
          progress: Math.min(user.totalWords, 10),
          target: 10
        },
        {
          id: 3,
          title: "词汇大师",
          description: "学习了50个单词",
          icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
          unlocked: user.totalWords >= 50,
          progress: Math.min(user.totalWords, 50),
          target: 50
        },
        {
          id: 4,
          title: "坚持不懈",
          description: "连续学习了3天",
          icon: <Calendar className="h-8 w-8 text-blue-500" />,
          unlocked: user.studiedDays >= 3,
          progress: Math.min(user.studiedDays, 3),
          target: 3
        },
        {
          id: 5,
          title: "学习达人",
          description: "连续学习了7天",
          icon: <Calendar className="h-8 w-8 text-purple-500" />,
          unlocked: user.studiedDays >= 7,
          progress: Math.min(user.studiedDays, 7),
          target: 7
        },
        {
          id: 6,
          title: "词汇之星",
          description: "完成一个分类的所有单词",
          icon: <Star className="h-8 w-8 text-yellow-500" />,
          unlocked: false, // 这需要从用户分类进度中计算
        }
      ];
      
      setAchievements(userAchievements);
    } else {
      // 未登录用户显示锁定的成就
      const defaultAchievements: Achievement[] = [
        {
          id: 1,
          title: "初学者",
          description: "学习了第一个单词",
          icon: <BookOpen className="h-8 w-8 text-gray-400" />,
          unlocked: false,
          progress: 0,
          target: 1
        },
        {
          id: 2,
          title: "单词收藏家",
          description: "学习了10个单词",
          icon: <BookOpen className="h-8 w-8 text-gray-400" />,
          unlocked: false,
          progress: 0,
          target: 10
        },
        {
          id: 3,
          title: "词汇大师",
          description: "学习了50个单词",
          icon: <BookOpen className="h-8 w-8 text-gray-400" />,
          unlocked: false,
          progress: 0,
          target: 50
        },
        {
          id: 4,
          title: "坚持不懈",
          description: "连续学习了3天",
          icon: <Calendar className="h-8 w-8 text-gray-400" />,
          unlocked: false,
          progress: 0,
          target: 3
        },
        {
          id: 5,
          title: "学习达人",
          description: "连续学习了7天",
          icon: <Calendar className="h-8 w-8 text-gray-400" />,
          unlocked: false,
          progress: 0,
          target: 7
        },
        {
          id: 6,
          title: "词汇之星",
          description: "完成一个分类的所有单词",
          icon: <Star className="h-8 w-8 text-gray-400" />,
          unlocked: false
        }
      ];
      
      setAchievements(defaultAchievements);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">成就</h1>
      </header>

      <main className="container max-w-md mx-auto p-4">
        <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-5 text-white mb-6">
          <div className="flex items-center mb-4">
            <Award className="h-10 w-10 mr-3" />
            <div>
              <h2 className="text-xl font-bold">成就收集</h2>
              <p className="opacity-90">
                完成各种学习目标解锁成就
              </p>
            </div>
          </div>
          <div className="bg-white/20 p-3 rounded-lg text-center">
            <p className="text-sm opacity-90">已解锁成就</p>
            <p className="text-2xl font-bold">
              {user ? achievements.filter(a => a.unlocked).length : 0}/{achievements.length}
            </p>
          </div>
        </div>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 rounded-lg text-yellow-700 text-center">
            <p className="mb-2">登录以跟踪并解锁你的成就</p>
            <Button 
              onClick={() => {
                window.location.href = '/profile';
              }}
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              前往登录
            </Button>
          </div>
        )}

        <div className="grid gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`bg-white rounded-xl p-4 shadow-sm flex items-center ${
                achievement.unlocked ? 'border-l-4 border-teal-500' : 'opacity-75'
              }`}
            >
              <div className={`p-3 rounded-full mr-4 ${
                achievement.unlocked ? 'bg-teal-50' : 'bg-gray-100'
              }`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">
                  {achievement.title}
                  {achievement.unlocked && (
                    <span className="ml-2 text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      已解锁
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                
                {achievement.progress !== undefined && achievement.target !== undefined && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${achievement.unlocked ? 'bg-teal-500' : 'bg-gray-300'}`}
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.progress}/{achievement.target}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Achievements;
