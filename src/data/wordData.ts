
export interface Word {
  id: number;
  english: string;
  chinese: string;
  pinyin: string;
  example: string;
  exampleTranslation: string;
  audioUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  wordCount: number;
  color: string;
  words: Word[];
}

export const categories: Category[] = [
  {
    id: 1,
    name: "基础词汇",
    icon: "book",
    description: "日常生活中最常用的单词",
    wordCount: 8,
    color: "bg-teal-400",
    words: [
      {
        id: 1,
        english: "Hello",
        chinese: "你好",
        pinyin: "nǐ hǎo",
        example: "Hello, how are you?",
        exampleTranslation: "你好，你好吗？",
        difficulty: "easy"
      },
      {
        id: 2,
        english: "Thank you",
        chinese: "谢谢",
        pinyin: "xiè xiè",
        example: "Thank you for your help.",
        exampleTranslation: "谢谢你的帮助。",
        difficulty: "easy"
      },
      {
        id: 3,
        english: "Yes",
        chinese: "是",
        pinyin: "shì",
        example: "Yes, I understand.",
        exampleTranslation: "是的，我明白。",
        difficulty: "easy"
      },
      {
        id: 4,
        english: "No",
        chinese: "不",
        pinyin: "bù",
        example: "No, I don't want it.",
        exampleTranslation: "不，我不想要。",
        difficulty: "easy"
      },
      {
        id: 5,
        english: "Sorry",
        chinese: "对不起",
        pinyin: "duì bù qǐ",
        example: "I'm sorry I'm late.",
        exampleTranslation: "对不起，我迟到了。",
        difficulty: "easy"
      },
      {
        id: 6,
        english: "Please",
        chinese: "请",
        pinyin: "qǐng",
        example: "Please help me.",
        exampleTranslation: "请帮助我。",
        difficulty: "easy"
      },
      {
        id: 7,
        english: "Goodbye",
        chinese: "再见",
        pinyin: "zài jiàn",
        example: "Goodbye, see you tomorrow.",
        exampleTranslation: "再见，明天见。",
        difficulty: "easy"
      },
      {
        id: 8,
        english: "Friend",
        chinese: "朋友",
        pinyin: "péng yǒu",
        example: "He is my good friend.",
        exampleTranslation: "他是我的好朋友。",
        difficulty: "easy"
      },
    ]
  },
  {
    id: 2,
    name: "数字",
    icon: "hash",
    description: "学习基本数字和计数方法",
    wordCount: 10,
    color: "bg-blue-400",
    words: [
      {
        id: 9,
        english: "One",
        chinese: "一",
        pinyin: "yī",
        example: "I need one ticket.",
        exampleTranslation: "我需要一张票。",
        difficulty: "easy"
      },
      {
        id: 10,
        english: "Two",
        chinese: "二",
        pinyin: "èr",
        example: "I have two brothers.",
        exampleTranslation: "我有两个兄弟。",
        difficulty: "easy"
      },
      {
        id: 11,
        english: "Three",
        chinese: "三",
        pinyin: "sān",
        example: "There are three books on the table.",
        exampleTranslation: "桌子上有三本书。",
        difficulty: "easy"
      },
      {
        id: 12,
        english: "Four",
        chinese: "四",
        pinyin: "sì",
        example: "We need four chairs.",
        exampleTranslation: "我们需要四把椅子。",
        difficulty: "easy"
      },
      {
        id: 13,
        english: "Five",
        chinese: "五",
        pinyin: "wǔ",
        example: "I have five fingers on my hand.",
        exampleTranslation: "我手上有五个手指。",
        difficulty: "easy"
      },
      {
        id: 14,
        english: "Ten",
        chinese: "十",
        pinyin: "shí",
        example: "There are ten people in the room.",
        exampleTranslation: "房间里有十个人。",
        difficulty: "medium"
      },
      {
        id: 15,
        english: "Hundred",
        chinese: "百",
        pinyin: "bǎi",
        example: "This book costs one hundred yuan.",
        exampleTranslation: "这本书花费一百元。",
        difficulty: "medium"
      },
      {
        id: 16,
        english: "Thousand",
        chinese: "千",
        pinyin: "qiān",
        example: "There are more than a thousand students in the school.",
        exampleTranslation: "学校里有超过一千名学生。",
        difficulty: "medium"
      },
      {
        id: 17,
        english: "Ten thousand",
        chinese: "万",
        pinyin: "wàn",
        example: "The car costs ten thousand dollars.",
        exampleTranslation: "这辆车要一万美元。",
        difficulty: "medium"
      },
      {
        id: 18,
        english: "Million",
        chinese: "百万",
        pinyin: "bǎi wàn",
        example: "The company is worth millions of dollars.",
        exampleTranslation: "这家公司价值数百万美元。",
        difficulty: "hard"
      }
    ]
  },
  {
    id: 3,
    name: "食物",
    icon: "utensils",
    description: "学习常见的食物和饮料词汇",
    wordCount: 7,
    color: "bg-orange-400",
    words: [
      {
        id: 19,
        english: "Rice",
        chinese: "米饭",
        pinyin: "mǐ fàn",
        example: "I eat rice every day.",
        exampleTranslation: "我每天吃米饭。",
        difficulty: "easy"
      },
      {
        id: 20,
        english: "Noodles",
        chinese: "面条",
        pinyin: "miàn tiáo",
        example: "I like to eat noodles for lunch.",
        exampleTranslation: "我喜欢午餐吃面条。",
        difficulty: "easy"
      },
      {
        id: 21,
        english: "Vegetables",
        chinese: "蔬菜",
        pinyin: "shū cài",
        example: "Eating vegetables is good for your health.",
        exampleTranslation: "吃蔬菜对健康有好处。",
        difficulty: "medium"
      },
      {
        id: 22,
        english: "Fruit",
        chinese: "水果",
        pinyin: "shuǐ guǒ",
        example: "I like to eat fruit after dinner.",
        exampleTranslation: "我喜欢晚饭后吃水果。",
        difficulty: "medium"
      },
      {
        id: 23,
        english: "Meat",
        chinese: "肉",
        pinyin: "ròu",
        example: "He doesn't eat meat.",
        exampleTranslation: "他不吃肉。",
        difficulty: "easy"
      },
      {
        id: 24,
        english: "Water",
        chinese: "水",
        pinyin: "shuǐ",
        example: "I drink a lot of water every day.",
        exampleTranslation: "我每天喝很多水。",
        difficulty: "easy"
      },
      {
        id: 25,
        english: "Tea",
        chinese: "茶",
        pinyin: "chá",
        example: "Would you like a cup of tea?",
        exampleTranslation: "你想喝一杯茶吗？",
        difficulty: "easy"
      }
    ]
  }
];

export const getAllWords = (): Word[] => {
  return categories.flatMap(category => category.words);
};

export const getWordById = (id: number): Word | undefined => {
  return getAllWords().find(word => word.id === id);
};

export const getWordsByCategory = (categoryId: number): Word[] => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.words : [];
};
