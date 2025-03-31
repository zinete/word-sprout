
// 用户学习记录的类型定义
export interface WordProgress {
  wordId: number;
  learned: boolean;
  reviewCount: number;
  lastReviewDate: string;
}

export interface CategoryProgress {
  categoryId: number;
  name: string;
  progress: number; // 0-100
  wordsProgress: WordProgress[];
}

export interface UserProgress {
  userId: string;
  studiedDays: number;
  lastStudyDate: string;
  totalWords: number;
  categories: CategoryProgress[];
}

// 获取用户学习进度
export const getUserProgress = (): UserProgress | null => {
  const progressData = localStorage.getItem('wordAppUserProgress');
  if (!progressData) return null;
  
  try {
    return JSON.parse(progressData) as UserProgress;
  } catch (error) {
    console.error('Error parsing user progress:', error);
    return null;
  }
};

// 保存用户学习进度
export const saveUserProgress = (progress: UserProgress): void => {
  localStorage.setItem('wordAppUserProgress', JSON.stringify(progress));
};

// 标记单词为已学习
export const markWordAsLearned = (
  userId: string, 
  categoryId: number, 
  wordId: number
): UserProgress => {
  let userProgress = getUserProgress();
  
  if (!userProgress) {
    userProgress = {
      userId,
      studiedDays: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      totalWords: 1,
      categories: [{
        categoryId,
        name: '', // 这里应该从分类数据中获取名称
        progress: 0,
        wordsProgress: [{
          wordId,
          learned: true,
          reviewCount: 1,
          lastReviewDate: new Date().toISOString(),
        }]
      }]
    };
  } else {
    // 检查今天是否已记录为学习日
    const today = new Date().toISOString().split('T')[0];
    if (userProgress.lastStudyDate !== today) {
      userProgress.studiedDays += 1;
      userProgress.lastStudyDate = today;
    }
    
    // 查找或创建类别进度
    let categoryProgress = userProgress.categories.find(c => c.categoryId === categoryId);
    if (!categoryProgress) {
      categoryProgress = {
        categoryId,
        name: '', // 这里应该从分类数据中获取名称
        progress: 0,
        wordsProgress: []
      };
      userProgress.categories.push(categoryProgress);
    }
    
    // 查找或创建单词进度
    let wordProgress = categoryProgress.wordsProgress.find(w => w.wordId === wordId);
    if (!wordProgress) {
      wordProgress = {
        wordId,
        learned: true,
        reviewCount: 1,
        lastReviewDate: new Date().toISOString(),
      };
      categoryProgress.wordsProgress.push(wordProgress);
      userProgress.totalWords += 1;
    } else {
      wordProgress.reviewCount += 1;
      wordProgress.lastReviewDate = new Date().toISOString();
    }
    
    // 更新类别学习进度
    updateCategoryProgress(categoryProgress);
  }
  
  saveUserProgress(userProgress);
  return userProgress;
};

// 更新类别的学习进度百分比
const updateCategoryProgress = (categoryProgress: CategoryProgress): void => {
  const totalWords = categoryProgress.wordsProgress.length;
  if (totalWords === 0) {
    categoryProgress.progress = 0;
    return;
  }
  
  const learnedWords = categoryProgress.wordsProgress.filter(w => w.learned).length;
  categoryProgress.progress = Math.round((learnedWords / totalWords) * 100);
};

// 获取单词的学习状态
export const getWordLearningStatus = (
  categoryId: number, 
  wordId: number
): WordProgress | null => {
  const userProgress = getUserProgress();
  if (!userProgress) return null;
  
  const categoryProgress = userProgress.categories.find(c => c.categoryId === categoryId);
  if (!categoryProgress) return null;
  
  return categoryProgress.wordsProgress.find(w => w.wordId === wordId) || null;
};

// 获取类别的学习进度
export const getCategoryProgress = (categoryId: number): CategoryProgress | null => {
  const userProgress = getUserProgress();
  if (!userProgress) return null;
  
  return userProgress.categories.find(c => c.categoryId === categoryId) || null;
};
