
import { supabase } from '@/lib/supabase';

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
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  if (!userId) return null;
  
  try {
    // 获取用户总体进度
    const { data: userProgressData, error: userProgressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (userProgressError) {
      console.error('获取用户进度错误:', userProgressError);
      return null;
    }
    
    // 获取类别进度
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('category_progress')
      .select('*')
      .eq('user_id', userId);
      
    if (categoriesError) {
      console.error('获取类别进度错误:', categoriesError);
      return null;
    }
    
    // 获取单词进度
    const { data: wordsData, error: wordsError } = await supabase
      .from('word_progress')
      .select('*')
      .eq('user_id', userId);
      
    if (wordsError) {
      console.error('获取单词进度错误:', wordsError);
      return null;
    }
    
    // 构建类别进度数据
    const categories: CategoryProgress[] = categoriesData.map(category => {
      // 过滤出该类别的单词进度
      const categoryWordsProgress = wordsData
        .filter(word => word.category_id === category.category_id)
        .map(word => ({
          wordId: word.word_id,
          learned: word.learned,
          reviewCount: word.review_count,
          lastReviewDate: word.last_review_date,
        }));
        
      return {
        categoryId: category.category_id,
        name: category.name,
        progress: category.progress,
        wordsProgress: categoryWordsProgress,
      };
    });
    
    // 构建用户进度数据
    return {
      userId,
      studiedDays: userProgressData.studied_days,
      lastStudyDate: userProgressData.last_study_date,
      totalWords: userProgressData.total_words,
      categories,
    };
  } catch (error) {
    console.error('获取用户进度错误:', error);
    return null;
  }
};

// 保存用户学习进度
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    // 更新用户总体进度
    const { error: userProgressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: progress.userId,
        studied_days: progress.studiedDays,
        last_study_date: progress.lastStudyDate,
        total_words: progress.totalWords,
        updated_at: new Date().toISOString(),
      });
      
    if (userProgressError) {
      throw userProgressError;
    }
    
    // 更新类别进度
    for (const category of progress.categories) {
      const { error: categoryError } = await supabase
        .from('category_progress')
        .upsert({
          user_id: progress.userId,
          category_id: category.categoryId,
          name: category.name,
          progress: category.progress,
          updated_at: new Date().toISOString(),
        });
        
      if (categoryError) {
        console.error(`更新类别 ${category.categoryId} 错误:`, categoryError);
      }
      
      // 更新单词进度
      for (const word of category.wordsProgress) {
        const { error: wordError } = await supabase
          .from('word_progress')
          .upsert({
            user_id: progress.userId,
            category_id: category.categoryId,
            word_id: word.wordId,
            learned: word.learned,
            review_count: word.reviewCount,
            last_review_date: word.lastReviewDate,
            updated_at: new Date().toISOString(),
          });
          
        if (wordError) {
          console.error(`更新单词 ${word.wordId} 错误:`, wordError);
        }
      }
    }
  } catch (error) {
    console.error('保存用户进度错误:', error);
    throw error;
  }
};

// 标记单词为已学习
export const markWordAsLearned = async (
  userId: string, 
  categoryId: number, 
  wordId: number,
  categoryName: string
): Promise<UserProgress> => {
  try {
    // 获取用户当前进度
    let userProgress = await getUserProgress(userId);
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    if (!userProgress) {
      // 创建新的用户进度记录
      const { error: userProgressError } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          studied_days: 1,
          last_study_date: today,
          total_words: 1,
        });
        
      if (userProgressError) {
        throw userProgressError;
      }
      
      // 创建新的类别进度记录
      const { error: categoryError } = await supabase
        .from('category_progress')
        .insert({
          user_id: userId,
          category_id: categoryId,
          name: categoryName,
          progress: 0,
        });
        
      if (categoryError) {
        throw categoryError;
      }
      
      // 创建新的单词进度记录
      const { error: wordError } = await supabase
        .from('word_progress')
        .insert({
          user_id: userId,
          category_id: categoryId,
          word_id: wordId,
          learned: true,
          review_count: 1,
          last_review_date: now,
        });
        
      if (wordError) {
        throw wordError;
      }
      
      // 构建并返回新的用户进度
      userProgress = {
        userId,
        studiedDays: 1,
        lastStudyDate: today,
        totalWords: 1,
        categories: [{
          categoryId,
          name: categoryName,
          progress: 0,
          wordsProgress: [{
            wordId,
            learned: true,
            reviewCount: 1,
            lastReviewDate: now,
          }]
        }]
      };
    } else {
      // 检查今天是否已记录为学习日
      if (userProgress.lastStudyDate !== today) {
        userProgress.studiedDays += 1;
        userProgress.lastStudyDate = today;
        
        // 更新用户总体进度
        const { error: updateDaysError } = await supabase
          .from('user_progress')
          .update({
            studied_days: userProgress.studiedDays,
            last_study_date: today,
          })
          .eq('user_id', userId);
          
        if (updateDaysError) {
          throw updateDaysError;
        }
      }
      
      // 查找或创建类别进度
      let categoryProgress = userProgress.categories.find(c => c.categoryId === categoryId);
      if (!categoryProgress) {
        categoryProgress = {
          categoryId,
          name: categoryName,
          progress: 0,
          wordsProgress: []
        };
        userProgress.categories.push(categoryProgress);
        
        // 创建新的类别进度记录
        const { error: categoryError } = await supabase
          .from('category_progress')
          .insert({
            user_id: userId,
            category_id: categoryId,
            name: categoryName,
            progress: 0,
          });
          
        if (categoryError) {
          throw categoryError;
        }
      }
      
      // 查找或创建单词进度
      let wordProgress = categoryProgress.wordsProgress.find(w => w.wordId === wordId);
      if (!wordProgress) {
        wordProgress = {
          wordId,
          learned: true,
          reviewCount: 1,
          lastReviewDate: now,
        };
        categoryProgress.wordsProgress.push(wordProgress);
        userProgress.totalWords += 1;
        
        // 创建新的单词进度记录
        const { error: wordError } = await supabase
          .from('word_progress')
          .insert({
            user_id: userId,
            category_id: categoryId,
            word_id: wordId,
            learned: true,
            review_count: 1,
            last_review_date: now,
          });
          
        if (wordError) {
          throw wordError;
        }
        
        // 更新用户总词数
        const { error: updateTotalError } = await supabase
          .from('user_progress')
          .update({
            total_words: userProgress.totalWords,
          })
          .eq('user_id', userId);
          
        if (updateTotalError) {
          throw updateTotalError;
        }
      } else {
        wordProgress.reviewCount += 1;
        wordProgress.lastReviewDate = now;
        
        // 更新单词进度
        const { error: updateWordError } = await supabase
          .from('word_progress')
          .update({
            review_count: wordProgress.reviewCount,
            last_review_date: now,
          })
          .eq('user_id', userId)
          .eq('category_id', categoryId)
          .eq('word_id', wordId);
          
        if (updateWordError) {
          throw updateWordError;
        }
      }
      
      // 更新类别学习进度
      updateCategoryProgress(categoryProgress);
      
      // 更新数据库中的类别进度
      const { error: updateCategoryError } = await supabase
        .from('category_progress')
        .update({
          progress: categoryProgress.progress,
        })
        .eq('user_id', userId)
        .eq('category_id', categoryId);
        
      if (updateCategoryError) {
        throw updateCategoryError;
      }
    }
    
    return userProgress;
  } catch (error) {
    console.error('标记单词为已学习错误:', error);
    throw error;
  }
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
export const getWordLearningStatus = async (
  userId: string,
  categoryId: number, 
  wordId: number
): Promise<WordProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('word_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .eq('word_id', wordId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // 没有找到记录
        return null;
      }
      throw error;
    }
    
    return {
      wordId: data.word_id,
      learned: data.learned,
      reviewCount: data.review_count,
      lastReviewDate: data.last_review_date,
    };
  } catch (error) {
    console.error('获取单词学习状态错误:', error);
    return null;
  }
};

// 获取类别的学习进度
export const getCategoryProgress = async (
  userId: string,
  categoryId: number
): Promise<CategoryProgress | null> => {
  try {
    // 获取类别进度
    const { data: categoryData, error: categoryError } = await supabase
      .from('category_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .single();
      
    if (categoryError) {
      if (categoryError.code === 'PGRST116') {
        // 没有找到记录
        return null;
      }
      throw categoryError;
    }
    
    // 获取该类别的单词进度
    const { data: wordsData, error: wordsError } = await supabase
      .from('word_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId);
      
    if (wordsError) {
      throw wordsError;
    }
    
    // 构建单词进度数组
    const wordsProgress = wordsData.map(word => ({
      wordId: word.word_id,
      learned: word.learned,
      reviewCount: word.review_count,
      lastReviewDate: word.last_review_date,
    }));
    
    // 返回类别进度
    return {
      categoryId,
      name: categoryData.name,
      progress: categoryData.progress,
      wordsProgress,
    };
  } catch (error) {
    console.error('获取类别进度错误:', error);
    return null;
  }
};
