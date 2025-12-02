// Common food database with nutritional information
export const foodDatabase = [
  // Breakfast
  { name: 'oatmeal', calories: 150, protein: 5, carbs: 27, fats: 3 },
  { name: 'scrambled eggs', calories: 200, protein: 14, carbs: 1, fats: 15 },
  { name: 'toast', calories: 80, protein: 3, carbs: 15, fats: 1 },
  { name: 'greek yogurt', calories: 100, protein: 10, carbs: 6, fats: 5 },
  { name: 'banana', calories: 105, protein: 1, carbs: 27, fats: 0 },
  { name: 'apple', calories: 95, protein: 0, carbs: 25, fats: 0 },
  { name: 'orange', calories: 62, protein: 1, carbs: 15, fats: 0 },
  { name: 'cereal', calories: 120, protein: 3, carbs: 24, fats: 2 },
  { name: 'milk', calories: 150, protein: 8, carbs: 12, fats: 8 },
  { name: 'coffee', calories: 2, protein: 0, carbs: 0, fats: 0 },
  { name: 'pancakes', calories: 230, protein: 6, carbs: 37, fats: 6 },
  { name: 'waffles', calories: 218, protein: 5, carbs: 31, fats: 9 },
  { name: 'bagel', calories: 250, protein: 10, carbs: 48, fats: 2 },
  { name: 'avocado toast', calories: 300, protein: 8, carbs: 30, fats: 18 },
  { name: 'smoothie', calories: 200, protein: 5, carbs: 40, fats: 3 },
  
  // Lunch
  { name: 'chicken breast', calories: 231, protein: 43, carbs: 0, fats: 5 },
  { name: 'grilled chicken', calories: 231, protein: 43, carbs: 0, fats: 5 },
  { name: 'salmon', calories: 206, protein: 22, carbs: 0, fats: 12 },
  { name: 'tuna', calories: 144, protein: 30, carbs: 0, fats: 1 },
  { name: 'rice', calories: 130, protein: 3, carbs: 28, fats: 0 },
  { name: 'brown rice', calories: 112, protein: 2, carbs: 23, fats: 1 },
  { name: 'quinoa', calories: 120, protein: 4, carbs: 22, fats: 2 },
  { name: 'pasta', calories: 131, protein: 5, carbs: 25, fats: 1 },
  { name: 'bread', calories: 80, protein: 3, carbs: 15, fats: 1 },
  { name: 'sandwich', calories: 350, protein: 15, carbs: 40, fats: 12 },
  { name: 'salad', calories: 50, protein: 2, carbs: 8, fats: 1 },
  { name: 'chicken salad', calories: 300, protein: 25, carbs: 15, fats: 15 },
  { name: 'caesar salad', calories: 470, protein: 9, carbs: 26, fats: 38 },
  { name: 'soup', calories: 100, protein: 5, carbs: 12, fats: 3 },
  { name: 'pizza slice', calories: 285, protein: 12, carbs: 36, fats: 10 },
  { name: 'burger', calories: 354, protein: 16, carbs: 33, fats: 14 },
  { name: 'fries', calories: 365, protein: 4, carbs: 63, fats: 17 },
  
  // Dinner
  { name: 'steak', calories: 271, protein: 25, carbs: 0, fats: 19 },
  { name: 'pork chop', calories: 231, protein: 24, carbs: 0, fats: 14 },
  { name: 'turkey', calories: 189, protein: 29, carbs: 0, fats: 7 },
  { name: 'baked fish', calories: 206, protein: 22, carbs: 0, fats: 12 },
  { name: 'mashed potatoes', calories: 88, protein: 2, carbs: 17, fats: 1 },
  { name: 'sweet potato', calories: 86, protein: 2, carbs: 20, fats: 0 },
  { name: 'broccoli', calories: 55, protein: 4, carbs: 11, fats: 1 },
  { name: 'carrots', calories: 41, protein: 1, carbs: 10, fats: 0 },
  { name: 'green beans', calories: 31, protein: 2, carbs: 7, fats: 0 },
  { name: 'asparagus', calories: 20, protein: 2, carbs: 4, fats: 0 },
  { name: 'stir fry', calories: 250, protein: 15, carbs: 20, fats: 12 },
  { name: 'curry', calories: 200, protein: 8, carbs: 25, fats: 8 },
  { name: 'spaghetti', calories: 221, protein: 8, carbs: 43, fats: 1 },
  { name: 'lasagna', calories: 221, protein: 12, carbs: 20, fats: 10 },
  { name: 'tacos', calories: 226, protein: 9, carbs: 20, fats: 12 },
  
  // Snacks
  { name: 'peanut butter', calories: 188, protein: 8, carbs: 6, fats: 16 },
  { name: 'almonds', calories: 164, protein: 6, carbs: 6, fats: 14 },
  { name: 'walnuts', calories: 185, protein: 4, carbs: 4, fats: 18 },
  { name: 'protein bar', calories: 200, protein: 20, carbs: 20, fats: 6 },
  { name: 'granola bar', calories: 132, protein: 3, carbs: 22, fats: 4 },
  { name: 'trail mix', calories: 150, protein: 4, carbs: 12, fats: 10 },
  { name: 'chips', calories: 152, protein: 2, carbs: 15, fats: 10 },
  { name: 'crackers', calories: 50, protein: 1, carbs: 8, fats: 1 },
  { name: 'cheese', calories: 113, protein: 7, carbs: 1, fats: 9 },
  { name: 'hummus', calories: 25, protein: 1, carbs: 2, fats: 2 },
  { name: 'yogurt', calories: 100, protein: 10, carbs: 6, fats: 5 },
  { name: 'cottage cheese', calories: 98, protein: 11, carbs: 3, fats: 4 },
  { name: 'dark chocolate', calories: 155, protein: 2, carbs: 13, fats: 11 },
  { name: 'popcorn', calories: 31, protein: 1, carbs: 6, fats: 0 },

  // Indian Breakfast Items
  { name: 'paratha', calories: 260, protein: 6, carbs: 35, fats: 10 },
  { name: 'aloo paratha', calories: 320, protein: 8, carbs: 42, fats: 12 },
  { name: 'gobi paratha', calories: 280, protein: 7, carbs: 38, fats: 11 },
  { name: 'puri', calories: 150, protein: 2, carbs: 20, fats: 7 },
  { name: 'bhatura', calories: 280, protein: 6, carbs: 40, fats: 10 },
  { name: 'dosa', calories: 120, protein: 3, carbs: 22, fats: 2 },
  { name: 'masala dosa', calories: 250, protein: 6, carbs: 35, fats: 8 },
  { name: 'idli', calories: 39, protein: 2, carbs: 8, fats: 0 },
  { name: 'vada', calories: 150, protein: 4, carbs: 20, fats: 5 },
  { name: 'upma', calories: 180, protein: 4, carbs: 30, fats: 4 },
  { name: 'poha', calories: 160, protein: 3, carbs: 32, fats: 2 },
  { name: 'uttapam', calories: 200, protein: 5, carbs: 35, fats: 4 },
  { name: 'medu vada', calories: 150, protein: 4, carbs: 20, fats: 5 },
  { name: 'sabudana khichdi', calories: 220, protein: 2, carbs: 45, fats: 3 },
  { name: 'dhokla', calories: 80, protein: 3, carbs: 15, fats: 1 },
  { name: 'khandvi', calories: 60, protein: 2, carbs: 10, fats: 1 },
  { name: 'thepla', calories: 180, protein: 5, carbs: 25, fats: 6 },
  { name: 'poha', calories: 160, protein: 3, carbs: 32, fats: 2 },
  { name: 'sevai', calories: 140, protein: 3, carbs: 28, fats: 1 },
  { name: 'appam', calories: 100, protein: 2, carbs: 20, fats: 1 },

  // Indian Main Dishes - Vegetarian
  { name: 'dal tadka', calories: 150, protein: 8, carbs: 20, fats: 4 },
  { name: 'dal makhani', calories: 250, protein: 10, carbs: 25, fats: 12 },
  { name: 'rajma', calories: 200, protein: 12, carbs: 30, fats: 4 },
  { name: 'chole', calories: 220, protein: 10, carbs: 35, fats: 5 },
  { name: 'chana masala', calories: 200, protein: 9, carbs: 32, fats: 4 },
  { name: 'aloo gobi', calories: 120, protein: 3, carbs: 20, fats: 3 },
  { name: 'baingan bharta', calories: 150, protein: 3, carbs: 15, fats: 8 },
  { name: 'palak paneer', calories: 280, protein: 15, carbs: 12, fats: 18 },
  { name: 'mutter paneer', calories: 250, protein: 14, carbs: 15, fats: 14 },
  { name: 'paneer butter masala', calories: 320, protein: 16, carbs: 18, fats: 20 },
  { name: 'paneer tikka', calories: 200, protein: 18, carbs: 8, fats: 10 },
  { name: 'aloo matar', calories: 140, protein: 4, carbs: 22, fats: 3 },
  { name: 'bhindi masala', calories: 100, protein: 3, carbs: 12, fats: 4 },
  { name: 'gobi manchurian', calories: 180, protein: 4, carbs: 25, fats: 6 },
  { name: 'vegetable biryani', calories: 350, protein: 8, carbs: 55, fats: 10 },
  { name: 'pulao', calories: 220, protein: 5, carbs: 40, fats: 4 },
  { name: 'khichdi', calories: 180, protein: 6, carbs: 32, fats: 3 },
  { name: 'sabzi', calories: 120, protein: 3, carbs: 15, fats: 5 },
  { name: 'mix vegetable', calories: 130, protein: 4, carbs: 18, fats: 4 },
  { name: 'dal fry', calories: 180, protein: 9, carbs: 22, fats: 6 },

  // Indian Main Dishes - Non-Vegetarian
  { name: 'butter chicken', calories: 380, protein: 28, carbs: 15, fats: 22 },
  { name: 'chicken tikka masala', calories: 350, protein: 26, carbs: 18, fats: 18 },
  { name: 'chicken curry', calories: 280, protein: 25, carbs: 12, fats: 14 },
  { name: 'chicken biryani', calories: 450, protein: 30, carbs: 50, fats: 15 },
  { name: 'mutton curry', calories: 320, protein: 28, carbs: 8, fats: 18 },
  { name: 'mutton biryani', calories: 480, protein: 32, carbs: 45, fats: 20 },
  { name: 'fish curry', calories: 220, protein: 22, carbs: 8, fats: 10 },
  { name: 'prawn curry', calories: 200, protein: 20, carbs: 6, fats: 9 },
  { name: 'egg curry', calories: 180, protein: 12, carbs: 8, fats: 10 },
  { name: 'chicken korma', calories: 340, protein: 24, carbs: 16, fats: 20 },
  { name: 'tandoori chicken', calories: 250, protein: 30, carbs: 5, fats: 10 },
  { name: 'chicken 65', calories: 280, protein: 22, carbs: 12, fats: 14 },
  { name: 'chicken vindaloo', calories: 300, protein: 26, carbs: 10, fats: 16 },
  { name: 'rogan josh', calories: 320, protein: 28, carbs: 8, fats: 18 },
  { name: 'chicken do pyaza', calories: 290, protein: 25, carbs: 14, fats: 15 },

  // Indian Rice & Breads
  { name: 'basmati rice', calories: 130, protein: 3, carbs: 28, fats: 0 },
  { name: 'jeera rice', calories: 150, protein: 3, carbs: 30, fats: 2 },
  { name: 'fried rice', calories: 200, protein: 4, carbs: 35, fats: 5 },
  { name: 'lemon rice', calories: 180, protein: 3, carbs: 32, fats: 4 },
  { name: 'coconut rice', calories: 220, protein: 3, carbs: 38, fats: 6 },
  { name: 'chapati', calories: 70, protein: 2, carbs: 15, fats: 1 },
  { name: 'roti', calories: 70, protein: 2, carbs: 15, fats: 1 },
  { name: 'naan', calories: 260, protein: 7, carbs: 45, fats: 4 },
  { name: 'butter naan', calories: 320, protein: 7, carbs: 45, fats: 12 },
  { name: 'garlic naan', calories: 300, protein: 7, carbs: 45, fats: 10 },
  { name: 'kulcha', calories: 280, protein: 6, carbs: 42, fats: 8 },
  { name: 'rumali roti', calories: 120, protein: 3, carbs: 22, fats: 2 },
  { name: 'missi roti', calories: 150, protein: 5, carbs: 25, fats: 3 },
  { name: 'makki ki roti', calories: 180, protein: 4, carbs: 30, fats: 4 },
  { name: 'bajra roti', calories: 160, protein: 5, carbs: 28, fats: 3 },

  // Indian Snacks & Street Food
  { name: 'samosa', calories: 250, protein: 4, carbs: 30, fats: 12 },
  { name: 'pakora', calories: 150, protein: 3, carbs: 18, fats: 7 },
  { name: 'bhajji', calories: 120, protein: 2, carbs: 15, fats: 5 },
  { name: 'vada pav', calories: 280, protein: 8, carbs: 35, fats: 12 },
  { name: 'pav bhaji', calories: 350, protein: 8, carbs: 45, fats: 15 },
  { name: 'bhel puri', calories: 180, protein: 4, carbs: 32, fats: 4 },
  { name: 'pani puri', calories: 50, protein: 1, carbs: 10, fats: 1 },
  { name: 'sev puri', calories: 200, protein: 3, carbs: 28, fats: 8 },
  { name: 'dahi puri', calories: 150, protein: 4, carbs: 22, fats: 5 },
  { name: 'ragda pattice', calories: 280, protein: 6, carbs: 35, fats: 12 },
  { name: 'kathi roll', calories: 320, protein: 15, carbs: 35, fats: 12 },
  { name: 'chole bhature', calories: 450, protein: 12, carbs: 55, fats: 18 },
  { name: 'aloo tikki', calories: 150, protein: 3, carbs: 20, fats: 6 },
  { name: 'dahi vada', calories: 120, protein: 4, carbs: 18, fats: 3 },
  { name: 'papdi chaat', calories: 220, protein: 4, carbs: 30, fats: 8 },
  { name: 'aloo chaat', calories: 180, protein: 3, carbs: 25, fats: 7 },
  { name: 'masala papad', calories: 80, protein: 3, carbs: 10, fats: 2 },
  { name: 'namkeen', calories: 200, protein: 4, carbs: 20, fats: 10 },
  { name: 'mixture', calories: 220, protein: 5, carbs: 22, fats: 11 },
  { name: 'sev', calories: 150, protein: 3, carbs: 15, fats: 8 },

  // Indian Sweets & Desserts
  { name: 'gulab jamun', calories: 150, protein: 2, carbs: 25, fats: 5 },
  { name: 'rasgulla', calories: 80, protein: 2, carbs: 18, fats: 0 },
  { name: 'rasmalai', calories: 120, protein: 4, carbs: 20, fats: 3 },
  { name: 'kheer', calories: 200, protein: 4, carbs: 35, fats: 5 },
  { name: 'payasam', calories: 180, protein: 3, carbs: 32, fats: 4 },
  { name: 'halwa', calories: 250, protein: 3, carbs: 40, fats: 8 },
  { name: 'gajar halwa', calories: 280, protein: 4, carbs: 42, fats: 10 },
  { name: 'sooji halwa', calories: 220, protein: 3, carbs: 35, fats: 7 },
  { name: 'besan ladoo', calories: 180, protein: 5, carbs: 20, fats: 8 },
  { name: 'motichoor ladoo', calories: 150, protein: 3, carbs: 25, fats: 5 },
  { name: 'jalebi', calories: 200, protein: 2, carbs: 45, fats: 3 },
  { name: 'barfi', calories: 220, protein: 4, carbs: 30, fats: 9 },
  { name: 'kaju katli', calories: 250, protein: 5, carbs: 25, fats: 15 },
  { name: 'peda', calories: 180, protein: 4, carbs: 20, fats: 8 },
  { name: 'sandesh', calories: 120, protein: 5, carbs: 15, fats: 5 },
  { name: 'rabri', calories: 280, protein: 6, carbs: 35, fats: 12 },
  { name: 'malpua', calories: 200, protein: 3, carbs: 35, fats: 6 },
  { name: 'gulab jamun', calories: 150, protein: 2, carbs: 25, fats: 5 },
  { name: 'kulfi', calories: 180, protein: 4, carbs: 25, fats: 7 },
  { name: 'falooda', calories: 250, protein: 4, carbs: 45, fats: 6 },

  // Indian Beverages
  { name: 'chai', calories: 50, protein: 1, carbs: 10, fats: 1 },
  { name: 'masala chai', calories: 60, protein: 1, carbs: 12, fats: 1 },
  { name: 'lassi', calories: 120, protein: 4, carbs: 18, fats: 3 },
  { name: 'mango lassi', calories: 180, protein: 4, carbs: 35, fats: 3 },
  { name: 'sweet lassi', calories: 150, protein: 4, carbs: 28, fats: 3 },
  { name: 'salted lassi', calories: 80, protein: 4, carbs: 10, fats: 2 },
  { name: 'buttermilk', calories: 40, protein: 2, carbs: 5, fats: 1 },
  { name: 'nimbu pani', calories: 30, protein: 0, carbs: 8, fats: 0 },
  { name: 'jal jeera', calories: 25, protein: 0, carbs: 6, fats: 0 },
  { name: 'aam panna', calories: 80, protein: 1, carbs: 20, fats: 0 },
  { name: 'rooh afza', calories: 100, protein: 0, carbs: 25, fats: 0 },
  { name: 'thandai', calories: 150, protein: 3, carbs: 25, fats: 4 },
  { name: 'badam milk', calories: 200, protein: 6, carbs: 25, fats: 8 },
  { name: 'rose milk', calories: 120, protein: 3, carbs: 20, fats: 3 },

  // Indian Pickles & Condiments
  { name: 'mango pickle', calories: 50, protein: 1, carbs: 8, fats: 2 },
  { name: 'lemon pickle', calories: 40, protein: 0, carbs: 6, fats: 1 },
  { name: 'mixed pickle', calories: 45, protein: 1, carbs: 7, fats: 2 },
  { name: 'chutney', calories: 30, protein: 1, carbs: 6, fats: 1 },
  { name: 'coconut chutney', calories: 80, protein: 1, carbs: 8, fats: 6 },
  { name: 'mint chutney', calories: 20, protein: 1, carbs: 3, fats: 0 },
  { name: 'tamarind chutney', calories: 60, protein: 0, carbs: 15, fats: 0 },
  { name: 'raita', calories: 50, protein: 2, carbs: 6, fats: 2 },
  { name: 'boondi raita', calories: 80, protein: 2, carbs: 10, fats: 3 },
  { name: 'onion raita', calories: 45, protein: 2, carbs: 5, fats: 2 },

  // Indian Lentils & Legumes
  { name: 'toor dal', calories: 120, protein: 7, carbs: 20, fats: 1 },
  { name: 'moong dal', calories: 110, protein: 7, carbs: 18, fats: 1 },
  { name: 'masoor dal', calories: 115, protein: 8, carbs: 19, fats: 1 },
  { name: 'chana dal', calories: 130, protein: 8, carbs: 22, fats: 2 },
  { name: 'urad dal', calories: 125, protein: 7, carbs: 20, fats: 1 },
  { name: 'black gram', calories: 130, protein: 8, carbs: 21, fats: 2 },
  { name: 'green gram', calories: 105, protein: 7, carbs: 17, fats: 1 },
  { name: 'kidney beans', calories: 120, protein: 8, carbs: 20, fats: 1 },
  { name: 'black beans', calories: 125, protein: 8, carbs: 21, fats: 1 },
  { name: 'chickpeas', calories: 130, protein: 7, carbs: 22, fats: 2 },

  // Indian Vegetables
  { name: 'brinjal', calories: 25, protein: 1, carbs: 6, fats: 0 },
  { name: 'okra', calories: 30, protein: 2, carbs: 7, fats: 0 },
  { name: 'bottle gourd', calories: 15, protein: 1, carbs: 3, fats: 0 },
  { name: 'ridge gourd', calories: 18, protein: 1, carbs: 4, fats: 0 },
  { name: 'bitter gourd', calories: 20, protein: 1, carbs: 4, fats: 0 },
  { name: 'drumstick', calories: 35, protein: 2, carbs: 8, fats: 0 },
  { name: 'raw banana', calories: 90, protein: 1, carbs: 23, fats: 0 },
  { name: 'plantain', calories: 120, protein: 1, carbs: 31, fats: 0 },
  { name: 'yam', calories: 110, protein: 2, carbs: 27, fats: 0 },
  { name: 'taro root', calories: 100, protein: 2, carbs: 25, fats: 0 },
];

// Search function to find food by name
export const searchFood = (query) => {
  if (!query || query.trim().length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchTerm)
  ).slice(0, 50); // Return top 50 matches
};

// Get exact match or closest match
export const getFoodInfo = (foodName) => {
  const searchTerm = foodName.toLowerCase().trim();
  const exactMatch = foodDatabase.find(food => 
    food.name.toLowerCase() === searchTerm
  );
  
  if (exactMatch) return exactMatch;
  
  // Return closest match
  const matches = searchFood(foodName);
  return matches.length > 0 ? matches[0] : null;
};
