
import React from 'react';
import { BarChart } from 'lucide-react';
import { categories } from '@/data/wordData';
import CategoryCard from '@/components/CategoryCard';

interface CategoryListProps {
  studiedWords: number[];
  onCategorySelect: (categoryId: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  studiedWords, 
  onCategorySelect 
}) => {
  return (
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
            onClick={() => onCategorySelect(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
