
import React from 'react';
import { Book, Hash, Utensils } from 'lucide-react';
import { Category } from '@/data/wordData';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const getIcon = () => {
    switch (category.icon) {
      case 'book':
        return <Book className="h-6 w-6 text-white" />;
      case 'hash':
        return <Hash className="h-6 w-6 text-white" />;
      case 'utensils':
        return <Utensils className="h-6 w-6 text-white" />;
      default:
        return <Book className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
      onClick={onClick}
    >
      <div className="flex items-start p-4">
        <div className={cn("p-3 rounded-lg mr-4", category.color)}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{category.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{category.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{category.wordCount} 个单词</span>
          </div>
        </div>
      </div>
      <div className="h-2 bg-gradient-to-r from-teal-400 to-blue-400"></div>
    </div>
  );
};

export default CategoryCard;
