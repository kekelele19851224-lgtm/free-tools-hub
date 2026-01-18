"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Recipe Database
// ============================================

interface Recipe {
  name: string;
  emoji: string;
  cuisine: string;
  mealType: string[];
  diet: string[];
  cookTime: number;
  difficulty: string;
  servings: string;
  ingredients: string[];
  tags: string[];
}

const recipes: Recipe[] = [
  // American
  {
    name: "Classic Cheeseburger",
    emoji: "🍔",
    cuisine: "american",
    mealType: ["dinner", "lunch"],
    diet: ["any", "comfort"],
    cookTime: 20,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Ground beef (500g)", "Burger buns (4)", "Cheddar cheese slices (4)", "Lettuce", "Tomato", "Onion", "Pickles", "Ketchup", "Mustard"],
    tags: ["classic", "grill", "comfort"]
  },
  {
    name: "Mac and Cheese",
    emoji: "🧀",
    cuisine: "american",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "comfort"],
    cookTime: 30,
    difficulty: "easy",
    servings: "4-6",
    ingredients: ["Elbow macaroni (400g)", "Cheddar cheese (300g)", "Milk (2 cups)", "Butter (4 tbsp)", "Flour (3 tbsp)", "Salt", "Pepper", "Paprika"],
    tags: ["pasta", "cheese", "comfort", "kid-friendly"]
  },
  {
    name: "BBQ Pulled Pork",
    emoji: "🍖",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 240,
    difficulty: "medium",
    servings: "8-10",
    ingredients: ["Pork shoulder (2kg)", "BBQ sauce (2 cups)", "Brown sugar", "Paprika", "Garlic powder", "Onion powder", "Coleslaw", "Burger buns"],
    tags: ["slow-cooker", "bbq", "party"]
  },
  {
    name: "Grilled Cheese Sandwich",
    emoji: "🥪",
    cuisine: "american",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "comfort", "quick"],
    cookTime: 10,
    difficulty: "easy",
    servings: "1-2",
    ingredients: ["Bread slices (4)", "Cheddar cheese (4 slices)", "Butter (2 tbsp)", "Optional: tomato soup"],
    tags: ["quick", "easy", "comfort", "kid-friendly"]
  },
  {
    name: "Chicken Fried Steak",
    emoji: "🥩",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 35,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Cube steaks (4)", "Flour (1 cup)", "Eggs (2)", "Milk (1 cup)", "Salt", "Pepper", "Oil for frying", "White gravy"],
    tags: ["southern", "comfort", "fried"]
  },
  {
    name: "Buffalo Chicken Wings",
    emoji: "🍗",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any"],
    cookTime: 45,
    difficulty: "medium",
    servings: "4-6",
    ingredients: ["Chicken wings (1kg)", "Hot sauce (1/2 cup)", "Butter (1/4 cup)", "Garlic powder", "Ranch or blue cheese dressing", "Celery sticks"],
    tags: ["spicy", "party", "game-day"]
  },
  {
    name: "Meatloaf",
    emoji: "🍖",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 60,
    difficulty: "easy",
    servings: "6-8",
    ingredients: ["Ground beef (750g)", "Breadcrumbs (1 cup)", "Egg (1)", "Onion (1)", "Ketchup", "Worcestershire sauce", "Salt", "Pepper"],
    tags: ["classic", "comfort", "family"]
  },

  // Italian
  {
    name: "Spaghetti Carbonara",
    emoji: "🍝",
    cuisine: "italian",
    mealType: ["dinner", "lunch"],
    diet: ["any", "comfort"],
    cookTime: 25,
    difficulty: "medium",
    servings: "2-3",
    ingredients: ["Spaghetti (400g)", "Bacon or pancetta (200g)", "Eggs (4)", "Parmesan cheese (100g)", "Black pepper", "Salt"],
    tags: ["pasta", "classic", "creamy"]
  },
  {
    name: "Margherita Pizza",
    emoji: "🍕",
    cuisine: "italian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "comfort"],
    cookTime: 30,
    difficulty: "medium",
    servings: "2-4",
    ingredients: ["Pizza dough", "Tomato sauce (1 cup)", "Fresh mozzarella (200g)", "Fresh basil", "Olive oil", "Salt"],
    tags: ["pizza", "classic", "vegetarian"]
  },
  {
    name: "Chicken Parmesan",
    emoji: "🍗",
    cuisine: "italian",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 40,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Chicken breasts (4)", "Breadcrumbs (1 cup)", "Parmesan (1/2 cup)", "Marinara sauce (2 cups)", "Mozzarella (200g)", "Eggs (2)", "Flour"],
    tags: ["chicken", "cheese", "baked"]
  },
  {
    name: "Lasagna",
    emoji: "🍝",
    cuisine: "italian",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 90,
    difficulty: "hard",
    servings: "8-10",
    ingredients: ["Lasagna noodles (12)", "Ground beef (500g)", "Ricotta cheese (450g)", "Mozzarella (400g)", "Parmesan (100g)", "Marinara sauce (3 cups)", "Eggs (2)"],
    tags: ["pasta", "baked", "family", "party"]
  },
  {
    name: "Fettuccine Alfredo",
    emoji: "🍝",
    cuisine: "italian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "comfort"],
    cookTime: 20,
    difficulty: "easy",
    servings: "3-4",
    ingredients: ["Fettuccine (400g)", "Heavy cream (2 cups)", "Butter (1/2 cup)", "Parmesan (1 cup)", "Garlic (3 cloves)", "Salt", "Pepper"],
    tags: ["pasta", "creamy", "quick"]
  },
  {
    name: "Caprese Salad",
    emoji: "🥗",
    cuisine: "italian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "healthy"],
    cookTime: 10,
    difficulty: "easy",
    servings: "2-4",
    ingredients: ["Fresh mozzarella (300g)", "Tomatoes (4 large)", "Fresh basil", "Olive oil", "Balsamic glaze", "Salt", "Pepper"],
    tags: ["salad", "fresh", "no-cook", "healthy"]
  },
  {
    name: "Risotto",
    emoji: "🍚",
    cuisine: "italian",
    mealType: ["dinner"],
    diet: ["vegetarian", "comfort"],
    cookTime: 35,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Arborio rice (1.5 cups)", "Chicken broth (4 cups)", "White wine (1/2 cup)", "Parmesan (1 cup)", "Butter", "Onion", "Garlic"],
    tags: ["rice", "creamy", "elegant"]
  },

  // Mexican
  {
    name: "Beef Tacos",
    emoji: "🌮",
    cuisine: "mexican",
    mealType: ["dinner", "lunch"],
    diet: ["any", "comfort"],
    cookTime: 25,
    difficulty: "easy",
    servings: "4-6",
    ingredients: ["Ground beef (500g)", "Taco shells (12)", "Taco seasoning", "Lettuce", "Tomatoes", "Cheese", "Sour cream", "Salsa"],
    tags: ["tacos", "quick", "family", "party"]
  },
  {
    name: "Chicken Quesadillas",
    emoji: "🧀",
    cuisine: "mexican",
    mealType: ["dinner", "lunch"],
    diet: ["any", "quick"],
    cookTime: 15,
    difficulty: "easy",
    servings: "2-4",
    ingredients: ["Flour tortillas (4 large)", "Cooked chicken (2 cups)", "Cheese (2 cups)", "Bell peppers", "Onion", "Sour cream", "Guacamole"],
    tags: ["quick", "easy", "cheese", "kid-friendly"]
  },
  {
    name: "Burrito Bowl",
    emoji: "🥗",
    cuisine: "mexican",
    mealType: ["dinner", "lunch"],
    diet: ["any", "healthy"],
    cookTime: 30,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Rice (2 cups)", "Black beans (1 can)", "Chicken or beef (500g)", "Corn", "Salsa", "Guacamole", "Cheese", "Lettuce", "Sour cream"],
    tags: ["bowl", "customizable", "healthy"]
  },
  {
    name: "Enchiladas",
    emoji: "🌯",
    cuisine: "mexican",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 45,
    difficulty: "medium",
    servings: "4-6",
    ingredients: ["Corn tortillas (12)", "Cooked chicken (3 cups)", "Enchilada sauce (2 cans)", "Cheese (2 cups)", "Onion", "Sour cream"],
    tags: ["baked", "cheese", "comfort"]
  },
  {
    name: "Nachos Supreme",
    emoji: "🧀",
    cuisine: "mexican",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 20,
    difficulty: "easy",
    servings: "4-6",
    ingredients: ["Tortilla chips", "Ground beef (300g)", "Cheese (2 cups)", "Jalapeños", "Black beans", "Sour cream", "Guacamole", "Salsa"],
    tags: ["party", "sharing", "quick"]
  },
  {
    name: "Fish Tacos",
    emoji: "🌮",
    cuisine: "mexican",
    mealType: ["dinner", "lunch"],
    diet: ["any", "healthy"],
    cookTime: 25,
    difficulty: "medium",
    servings: "4",
    ingredients: ["White fish (500g)", "Corn tortillas (8)", "Cabbage slaw", "Chipotle mayo", "Lime", "Cilantro", "Avocado"],
    tags: ["seafood", "fresh", "healthy"]
  },

  // Asian
  {
    name: "Chicken Stir Fry",
    emoji: "🥘",
    cuisine: "asian",
    mealType: ["dinner", "lunch"],
    diet: ["any", "healthy", "quick"],
    cookTime: 20,
    difficulty: "easy",
    servings: "3-4",
    ingredients: ["Chicken breast (500g)", "Mixed vegetables (4 cups)", "Soy sauce", "Garlic", "Ginger", "Sesame oil", "Rice"],
    tags: ["quick", "healthy", "wok"]
  },
  {
    name: "Fried Rice",
    emoji: "🍚",
    cuisine: "asian",
    mealType: ["dinner", "lunch"],
    diet: ["any", "quick"],
    cookTime: 15,
    difficulty: "easy",
    servings: "3-4",
    ingredients: ["Cooked rice (4 cups, day-old)", "Eggs (3)", "Peas", "Carrots", "Green onions", "Soy sauce", "Sesame oil", "Protein of choice"],
    tags: ["quick", "easy", "leftover-friendly"]
  },
  {
    name: "Beef and Broccoli",
    emoji: "🥦",
    cuisine: "asian",
    mealType: ["dinner"],
    diet: ["any", "healthy"],
    cookTime: 25,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Beef sirloin (500g)", "Broccoli (4 cups)", "Soy sauce", "Oyster sauce", "Garlic", "Ginger", "Cornstarch", "Rice"],
    tags: ["classic", "healthy", "quick"]
  },
  {
    name: "Pad Thai",
    emoji: "🍜",
    cuisine: "asian",
    mealType: ["dinner", "lunch"],
    diet: ["any"],
    cookTime: 30,
    difficulty: "medium",
    servings: "3-4",
    ingredients: ["Rice noodles (300g)", "Shrimp or chicken (300g)", "Eggs (2)", "Bean sprouts", "Peanuts", "Lime", "Fish sauce", "Tamarind paste", "Green onions"],
    tags: ["noodles", "thai", "classic"]
  },
  {
    name: "Teriyaki Salmon",
    emoji: "🍣",
    cuisine: "asian",
    mealType: ["dinner"],
    diet: ["any", "healthy"],
    cookTime: 25,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Salmon fillets (4)", "Soy sauce", "Mirin", "Brown sugar", "Garlic", "Ginger", "Sesame seeds", "Rice", "Steamed vegetables"],
    tags: ["seafood", "healthy", "elegant"]
  },
  {
    name: "Kung Pao Chicken",
    emoji: "🍗",
    cuisine: "asian",
    mealType: ["dinner"],
    diet: ["any"],
    cookTime: 25,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Chicken breast (500g)", "Peanuts (1/2 cup)", "Dried chilies", "Soy sauce", "Rice vinegar", "Garlic", "Ginger", "Green onions", "Rice"],
    tags: ["spicy", "chinese", "classic"]
  },
  {
    name: "Ramen",
    emoji: "🍜",
    cuisine: "asian",
    mealType: ["dinner", "lunch"],
    diet: ["any", "comfort"],
    cookTime: 30,
    difficulty: "medium",
    servings: "2-4",
    ingredients: ["Ramen noodles", "Chicken or pork broth (6 cups)", "Soft-boiled eggs", "Sliced pork or chicken", "Green onions", "Nori", "Corn", "Mushrooms"],
    tags: ["noodles", "soup", "japanese", "comfort"]
  },
  {
    name: "Orange Chicken",
    emoji: "🍊",
    cuisine: "asian",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 35,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Chicken breast (600g)", "Orange juice (1 cup)", "Soy sauce", "Brown sugar", "Rice vinegar", "Garlic", "Ginger", "Cornstarch", "Rice"],
    tags: ["sweet", "crispy", "takeout-style"]
  },

  // Indian
  {
    name: "Chicken Tikka Masala",
    emoji: "🍛",
    cuisine: "indian",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 45,
    difficulty: "medium",
    servings: "4-6",
    ingredients: ["Chicken breast (600g)", "Yogurt (1 cup)", "Tomato sauce (2 cups)", "Heavy cream (1 cup)", "Garam masala", "Turmeric", "Cumin", "Garlic", "Ginger", "Rice or naan"],
    tags: ["curry", "creamy", "spiced"]
  },
  {
    name: "Butter Chicken",
    emoji: "🍗",
    cuisine: "indian",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 40,
    difficulty: "medium",
    servings: "4-6",
    ingredients: ["Chicken thighs (600g)", "Butter (4 tbsp)", "Tomato puree (2 cups)", "Heavy cream (1 cup)", "Garam masala", "Fenugreek", "Garlic", "Ginger", "Naan bread"],
    tags: ["curry", "creamy", "rich"]
  },
  {
    name: "Vegetable Curry",
    emoji: "🥘",
    cuisine: "indian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan", "healthy"],
    cookTime: 35,
    difficulty: "easy",
    servings: "4-6",
    ingredients: ["Mixed vegetables (6 cups)", "Coconut milk (1 can)", "Curry paste or powder", "Onion", "Garlic", "Ginger", "Tomatoes", "Rice"],
    tags: ["curry", "vegetarian", "healthy"]
  },
  {
    name: "Dal (Lentil Curry)",
    emoji: "🍲",
    cuisine: "indian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan", "healthy"],
    cookTime: 40,
    difficulty: "easy",
    servings: "4-6",
    ingredients: ["Red lentils (2 cups)", "Onion", "Tomatoes", "Garlic", "Ginger", "Turmeric", "Cumin", "Garam masala", "Cilantro", "Rice or naan"],
    tags: ["lentils", "protein", "comfort", "budget"]
  },
  {
    name: "Biryani",
    emoji: "🍚",
    cuisine: "indian",
    mealType: ["dinner"],
    diet: ["any"],
    cookTime: 60,
    difficulty: "hard",
    servings: "6-8",
    ingredients: ["Basmati rice (2 cups)", "Chicken or lamb (600g)", "Yogurt (1 cup)", "Onions (3)", "Saffron", "Garam masala", "Cardamom", "Cinnamon", "Mint", "Cilantro"],
    tags: ["rice", "festive", "special-occasion"]
  },
  {
    name: "Palak Paneer",
    emoji: "🧀",
    cuisine: "indian",
    mealType: ["dinner"],
    diet: ["vegetarian"],
    cookTime: 35,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Paneer (400g)", "Spinach (500g)", "Onion", "Tomatoes", "Cream (1/4 cup)", "Garlic", "Ginger", "Garam masala", "Cumin"],
    tags: ["vegetarian", "spinach", "protein"]
  },

  // Mediterranean
  {
    name: "Greek Salad",
    emoji: "🥗",
    cuisine: "mediterranean",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "healthy"],
    cookTime: 15,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Cucumber (2)", "Tomatoes (4)", "Red onion (1)", "Feta cheese (200g)", "Kalamata olives", "Olive oil", "Red wine vinegar", "Oregano"],
    tags: ["salad", "fresh", "no-cook", "healthy"]
  },
  {
    name: "Chicken Shawarma",
    emoji: "🥙",
    cuisine: "mediterranean",
    mealType: ["dinner", "lunch"],
    diet: ["any", "healthy"],
    cookTime: 30,
    difficulty: "medium",
    servings: "4-6",
    ingredients: ["Chicken thighs (600g)", "Shawarma spices", "Pita bread", "Tahini sauce", "Pickles", "Tomatoes", "Onion", "Lettuce"],
    tags: ["wrap", "spiced", "grilled"]
  },
  {
    name: "Falafel Wrap",
    emoji: "🥙",
    cuisine: "mediterranean",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan", "healthy"],
    cookTime: 35,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Chickpeas (2 cans)", "Onion", "Garlic", "Parsley", "Cumin", "Coriander", "Pita bread", "Tahini", "Vegetables"],
    tags: ["vegetarian", "fried", "wrap"]
  },
  {
    name: "Hummus Platter",
    emoji: "🫓",
    cuisine: "mediterranean",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan", "healthy"],
    cookTime: 15,
    difficulty: "easy",
    servings: "4-6",
    ingredients: ["Chickpeas (2 cans)", "Tahini (1/4 cup)", "Lemon juice", "Garlic", "Olive oil", "Paprika", "Pita bread", "Vegetables for dipping"],
    tags: ["dip", "sharing", "healthy"]
  },
  {
    name: "Grilled Lamb Kebabs",
    emoji: "🍢",
    cuisine: "mediterranean",
    mealType: ["dinner"],
    diet: ["any"],
    cookTime: 30,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Lamb cubes (600g)", "Bell peppers", "Onion", "Olive oil", "Lemon juice", "Garlic", "Oregano", "Cumin", "Rice or pita"],
    tags: ["grill", "kebab", "protein"]
  },
  {
    name: "Moussaka",
    emoji: "🍆",
    cuisine: "mediterranean",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 90,
    difficulty: "hard",
    servings: "8",
    ingredients: ["Eggplant (2 large)", "Ground lamb (500g)", "Tomato sauce (2 cups)", "Béchamel sauce", "Onion", "Garlic", "Cinnamon", "Parmesan"],
    tags: ["baked", "greek", "comfort", "special-occasion"]
  },

  // Healthy Options
  {
    name: "Grilled Salmon with Vegetables",
    emoji: "🐟",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any", "healthy"],
    cookTime: 25,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Salmon fillets (4)", "Asparagus (1 bunch)", "Cherry tomatoes", "Olive oil", "Lemon", "Garlic", "Herbs"],
    tags: ["seafood", "healthy", "low-carb", "protein"]
  },
  {
    name: "Quinoa Buddha Bowl",
    emoji: "🥗",
    cuisine: "american",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan", "healthy"],
    cookTime: 30,
    difficulty: "easy",
    servings: "2-4",
    ingredients: ["Quinoa (1 cup)", "Chickpeas (1 can)", "Roasted vegetables", "Avocado", "Tahini dressing", "Lemon", "Mixed greens"],
    tags: ["bowl", "healthy", "protein", "vegetarian"]
  },
  {
    name: "Grilled Chicken Salad",
    emoji: "🥗",
    cuisine: "american",
    mealType: ["dinner", "lunch"],
    diet: ["any", "healthy"],
    cookTime: 25,
    difficulty: "easy",
    servings: "2-4",
    ingredients: ["Chicken breast (2)", "Mixed greens (6 cups)", "Cherry tomatoes", "Cucumber", "Red onion", "Feta cheese", "Olive oil", "Balsamic vinegar"],
    tags: ["salad", "healthy", "protein", "low-carb"]
  },
  {
    name: "Shrimp and Vegetable Skewers",
    emoji: "🍤",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any", "healthy"],
    cookTime: 20,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Large shrimp (500g)", "Zucchini", "Bell peppers", "Cherry tomatoes", "Olive oil", "Garlic", "Lemon", "Herbs"],
    tags: ["seafood", "grill", "healthy", "low-carb"]
  },
  {
    name: "Cauliflower Fried Rice",
    emoji: "🍚",
    cuisine: "asian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "healthy"],
    cookTime: 20,
    difficulty: "easy",
    servings: "3-4",
    ingredients: ["Cauliflower rice (4 cups)", "Eggs (2)", "Peas", "Carrots", "Green onions", "Soy sauce", "Sesame oil", "Garlic"],
    tags: ["low-carb", "healthy", "quick"]
  },

  // Quick Meals
  {
    name: "BLT Sandwich",
    emoji: "🥪",
    cuisine: "american",
    mealType: ["dinner", "lunch"],
    diet: ["any", "quick"],
    cookTime: 15,
    difficulty: "easy",
    servings: "2",
    ingredients: ["Bread (4 slices)", "Bacon (8 strips)", "Lettuce", "Tomato", "Mayo"],
    tags: ["quick", "classic", "sandwich"]
  },
  {
    name: "Avocado Toast",
    emoji: "🥑",
    cuisine: "american",
    mealType: ["dinner", "lunch", "breakfast"],
    diet: ["vegetarian", "vegan", "healthy", "quick"],
    cookTime: 10,
    difficulty: "easy",
    servings: "2",
    ingredients: ["Bread (2 slices)", "Avocado (1)", "Lemon juice", "Salt", "Pepper", "Optional: eggs, tomatoes, feta"],
    tags: ["quick", "healthy", "trendy"]
  },
  {
    name: "Egg Fried Rice",
    emoji: "🍳",
    cuisine: "asian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "quick"],
    cookTime: 15,
    difficulty: "easy",
    servings: "2-3",
    ingredients: ["Cooked rice (3 cups)", "Eggs (3)", "Green onions", "Soy sauce", "Sesame oil", "Peas", "Garlic"],
    tags: ["quick", "easy", "budget", "leftover-friendly"]
  },
  {
    name: "Tomato Soup with Grilled Cheese",
    emoji: "🍅",
    cuisine: "american",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "comfort"],
    cookTime: 25,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Canned tomatoes (2 cans)", "Onion", "Garlic", "Cream", "Basil", "Bread", "Butter", "Cheddar cheese"],
    tags: ["soup", "comfort", "classic", "kid-friendly"]
  },
  {
    name: "Pesto Pasta",
    emoji: "🍝",
    cuisine: "italian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "quick"],
    cookTime: 20,
    difficulty: "easy",
    servings: "3-4",
    ingredients: ["Pasta (400g)", "Basil pesto (1 cup)", "Cherry tomatoes", "Parmesan cheese", "Pine nuts", "Olive oil"],
    tags: ["quick", "easy", "vegetarian"]
  },

  // Comfort Food
  {
    name: "Shepherd's Pie",
    emoji: "🥧",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 60,
    difficulty: "medium",
    servings: "6-8",
    ingredients: ["Ground lamb or beef (500g)", "Potatoes (1kg)", "Onion", "Carrots", "Peas", "Beef broth", "Worcestershire sauce", "Butter", "Milk"],
    tags: ["baked", "comfort", "british", "family"]
  },
  {
    name: "Pot Roast",
    emoji: "🍖",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 180,
    difficulty: "easy",
    servings: "6-8",
    ingredients: ["Chuck roast (1.5kg)", "Potatoes (6)", "Carrots (4)", "Onion (2)", "Beef broth (2 cups)", "Garlic", "Thyme", "Rosemary"],
    tags: ["slow-cooker", "comfort", "sunday-dinner"]
  },
  {
    name: "Chicken Pot Pie",
    emoji: "🥧",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 60,
    difficulty: "medium",
    servings: "6",
    ingredients: ["Cooked chicken (3 cups)", "Pie crust (2)", "Mixed vegetables (2 cups)", "Cream of chicken soup", "Butter", "Flour", "Chicken broth"],
    tags: ["baked", "comfort", "classic"]
  },
  {
    name: "Chili Con Carne",
    emoji: "🌶️",
    cuisine: "mexican",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 45,
    difficulty: "easy",
    servings: "6-8",
    ingredients: ["Ground beef (500g)", "Kidney beans (2 cans)", "Diced tomatoes (2 cans)", "Onion", "Garlic", "Chili powder", "Cumin", "Sour cream", "Cheese"],
    tags: ["spicy", "comfort", "one-pot"]
  },

  // Fast Food Style
  {
    name: "Homemade Pizza",
    emoji: "🍕",
    cuisine: "fast_food",
    mealType: ["dinner"],
    diet: ["any", "comfort"],
    cookTime: 35,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Pizza dough", "Pizza sauce", "Mozzarella cheese", "Pepperoni", "Toppings of choice"],
    tags: ["pizza", "customizable", "family", "kid-friendly"]
  },
  {
    name: "Chicken Nuggets",
    emoji: "🍗",
    cuisine: "fast_food",
    mealType: ["dinner", "lunch"],
    diet: ["any", "quick"],
    cookTime: 25,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Chicken breast (500g)", "Breadcrumbs (1 cup)", "Flour", "Eggs (2)", "Salt", "Pepper", "Oil for frying", "Dipping sauces"],
    tags: ["fried", "kid-friendly", "quick"]
  },
  {
    name: "French Fries",
    emoji: "🍟",
    cuisine: "fast_food",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan"],
    cookTime: 30,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Potatoes (1kg)", "Oil for frying", "Salt", "Optional: ketchup, mayo"],
    tags: ["fried", "side-dish", "classic"]
  },
  {
    name: "Hot Dogs",
    emoji: "🌭",
    cuisine: "fast_food",
    mealType: ["dinner", "lunch"],
    diet: ["any", "quick"],
    cookTime: 15,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Hot dog sausages (8)", "Hot dog buns (8)", "Mustard", "Ketchup", "Relish", "Onions"],
    tags: ["quick", "easy", "kid-friendly", "bbq"]
  },
  {
    name: "Loaded Baked Potato",
    emoji: "🥔",
    cuisine: "american",
    mealType: ["dinner"],
    diet: ["vegetarian", "comfort"],
    cookTime: 60,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Large potatoes (4)", "Butter", "Sour cream", "Cheese", "Bacon bits", "Chives", "Salt", "Pepper"],
    tags: ["baked", "comfort", "customizable"]
  },

  // Vegetarian
  {
    name: "Vegetable Stir Fry",
    emoji: "🥬",
    cuisine: "asian",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan", "healthy", "quick"],
    cookTime: 20,
    difficulty: "easy",
    servings: "3-4",
    ingredients: ["Mixed vegetables (6 cups)", "Tofu (optional)", "Soy sauce", "Garlic", "Ginger", "Sesame oil", "Rice"],
    tags: ["quick", "healthy", "vegetarian"]
  },
  {
    name: "Vegetable Soup",
    emoji: "🍲",
    cuisine: "american",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan", "healthy"],
    cookTime: 40,
    difficulty: "easy",
    servings: "6",
    ingredients: ["Mixed vegetables (6 cups)", "Vegetable broth (6 cups)", "Diced tomatoes (1 can)", "Onion", "Garlic", "Italian herbs", "Pasta (optional)"],
    tags: ["soup", "healthy", "comfort"]
  },
  {
    name: "Mushroom Risotto",
    emoji: "🍄",
    cuisine: "italian",
    mealType: ["dinner"],
    diet: ["vegetarian"],
    cookTime: 40,
    difficulty: "medium",
    servings: "4",
    ingredients: ["Arborio rice (1.5 cups)", "Mushrooms (400g)", "Vegetable broth (4 cups)", "White wine (1/2 cup)", "Parmesan (1 cup)", "Butter", "Onion", "Garlic"],
    tags: ["rice", "creamy", "elegant", "vegetarian"]
  },
  {
    name: "Eggplant Parmesan",
    emoji: "🍆",
    cuisine: "italian",
    mealType: ["dinner"],
    diet: ["vegetarian"],
    cookTime: 60,
    difficulty: "medium",
    servings: "6",
    ingredients: ["Eggplant (2 large)", "Marinara sauce (3 cups)", "Mozzarella (300g)", "Parmesan (1 cup)", "Breadcrumbs", "Eggs", "Flour"],
    tags: ["baked", "vegetarian", "cheese"]
  },
  {
    name: "Black Bean Tacos",
    emoji: "🌮",
    cuisine: "mexican",
    mealType: ["dinner", "lunch"],
    diet: ["vegetarian", "vegan", "healthy"],
    cookTime: 20,
    difficulty: "easy",
    servings: "4",
    ingredients: ["Black beans (2 cans)", "Taco shells (8)", "Lettuce", "Tomatoes", "Cheese", "Sour cream", "Salsa", "Lime", "Cumin"],
    tags: ["vegetarian", "quick", "healthy", "budget"]
  }
];

// FAQ data
const faqs = [
  {
    question: "How does the random dinner generator work?",
    answer: "Simply select your preferences (cuisine, diet, cooking time, servings) and click 'Generate Dinner Idea.' The generator will randomly select a recipe from our database that matches your criteria. Each recipe includes ingredients, cooking time, difficulty level, and serving size."
  },
  {
    question: "Can I filter by dietary restrictions?",
    answer: "Yes! You can filter by Vegetarian, Vegan, Healthy, Comfort Food, or Quick meals. The generator will only show recipes that match your dietary preference. You can also select 'Any' to see all available options."
  },
  {
    question: "What cuisines are available?",
    answer: "We offer recipes from American, Italian, Mexican, Asian (Chinese, Thai, Japanese), Indian, Mediterranean cuisines, plus Fast Food style homemade options. Each cuisine has multiple dishes to choose from."
  },
  {
    question: "Can I generate meals for a specific number of people?",
    answer: "Yes! You can select serving sizes for 1-2 people, 3-4 people, or 5+ people. The generator will show recipes with appropriate serving sizes and ingredient quantities."
  },
  {
    question: "How do I find quick dinner ideas?",
    answer: "Select 'Quick (<20 min)' in the cooking time filter to see only recipes that can be prepared in under 20 minutes. You can also combine this with other filters like cuisine or diet preference."
  },
  {
    question: "Can vegetarians use this generator?",
    answer: "Absolutely! Select 'Vegetarian' or 'Vegan' in the diet filter to see only plant-based recipes. We have a variety of vegetarian options from different cuisines including Italian pasta, Asian stir-fries, Mexican tacos, and more."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        <h3 style={{ fontWeight: "600", color: "#111827", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#6B7280", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

// Helper function
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function RandomDinnerGenerator() {
  const [cuisine, setCuisine] = useState("any");
  const [diet, setDiet] = useState("any");
  const [cookTime, setCookTime] = useState("any");
  const [servings, setServings] = useState("any");
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [copied, setCopied] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // Cuisine labels
  const cuisineLabels: { [key: string]: { label: string; emoji: string } } = {
    any: { label: "Any Cuisine", emoji: "🌍" },
    american: { label: "American", emoji: "🇺🇸" },
    italian: { label: "Italian", emoji: "🇮🇹" },
    mexican: { label: "Mexican", emoji: "🇲🇽" },
    asian: { label: "Asian", emoji: "🥢" },
    indian: { label: "Indian", emoji: "🇮🇳" },
    mediterranean: { label: "Mediterranean", emoji: "🫒" },
    fast_food: { label: "Fast Food Style", emoji: "🍟" }
  };

  // Diet labels
  const dietLabels: { [key: string]: { label: string; emoji: string } } = {
    any: { label: "Any", emoji: "🍽️" },
    vegetarian: { label: "Vegetarian", emoji: "🥬" },
    vegan: { label: "Vegan", emoji: "🌱" },
    healthy: { label: "Healthy", emoji: "💚" },
    comfort: { label: "Comfort Food", emoji: "🍲" },
    quick: { label: "Quick & Easy", emoji: "⚡" }
  };

  // Generate function
  const generateDinner = () => {
    let filteredRecipes = [...recipes];

    // Filter by cuisine
    if (cuisine !== "any") {
      filteredRecipes = filteredRecipes.filter(r => r.cuisine === cuisine);
    }

    // Filter by diet
    if (diet !== "any") {
      filteredRecipes = filteredRecipes.filter(r => r.diet.includes(diet));
    }

    // Filter by cook time
    if (cookTime === "quick") {
      filteredRecipes = filteredRecipes.filter(r => r.cookTime <= 20);
    } else if (cookTime === "medium") {
      filteredRecipes = filteredRecipes.filter(r => r.cookTime > 20 && r.cookTime <= 45);
    } else if (cookTime === "long") {
      filteredRecipes = filteredRecipes.filter(r => r.cookTime > 45);
    }

    // Filter by servings
    if (servings === "small") {
      filteredRecipes = filteredRecipes.filter(r => {
        const match = r.servings.match(/\d+/);
        return match && parseInt(match[0]) <= 2;
      });
    } else if (servings === "medium") {
      filteredRecipes = filteredRecipes.filter(r => {
        const match = r.servings.match(/\d+/);
        return match && parseInt(match[0]) >= 3 && parseInt(match[0]) <= 4;
      });
    } else if (servings === "large") {
      filteredRecipes = filteredRecipes.filter(r => {
        const match = r.servings.match(/\d+/);
        return match && parseInt(match[0]) >= 5;
      });
    }

    if (filteredRecipes.length === 0) {
      setNoResults(true);
      setGeneratedRecipe(null);
      return;
    }

    setNoResults(false);
    setGeneratedRecipe(getRandomItem(filteredRecipes));
    setCopied(false);
  };

  // Copy function
  const copyToClipboard = async () => {
    if (!generatedRecipe) return;
    const text = `${generatedRecipe.name}\n\nIngredients:\n${generatedRecipe.ingredients.map(i => `• ${i}`).join('\n')}\n\nCook Time: ${generatedRecipe.cookTime} minutes\nServings: ${generatedRecipe.servings}\nDifficulty: ${generatedRecipe.difficulty}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "#10B981";
      case "medium": return "#F59E0B";
      case "hard": return "#EF4444";
      default: return "#6B7280";
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF7ED" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FED7AA" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Random Dinner Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🍽️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Random Dinner Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Can&apos;t decide what to eat for dinner? Let our random dinner generator pick for you! 
            Filter by cuisine, diet, cooking time, and more.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#EA580C",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>What&apos;s for dinner tonight?</strong>
              </p>
              <p style={{ color: "#FED7AA", margin: 0, fontSize: "0.95rem" }}>
                Set your preferences and let us surprise you with a delicious meal idea. Each recipe includes ingredients and cooking time!
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FED7AA",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Your Preferences
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Cuisine */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🌍 Cuisine
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {Object.entries(cuisineLabels).map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setCuisine(key)}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: cuisine === key ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: cuisine === key ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: cuisine === key ? "600" : "400",
                        color: cuisine === key ? "#EA580C" : "#4B5563",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🥗 Diet Preference
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {Object.entries(dietLabels).map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setDiet(key)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: diet === key ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: diet === key ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: diet === key ? "600" : "400",
                        color: diet === key ? "#EA580C" : "#4B5563",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cook Time */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  ⏱️ Cooking Time
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: "any", label: "Any", desc: "" },
                    { value: "quick", label: "Quick", desc: "<20 min" },
                    { value: "medium", label: "Medium", desc: "20-45 min" },
                    { value: "long", label: "Long", desc: "45+ min" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCookTime(option.value)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: cookTime === option.value ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: cookTime === option.value ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        flex: 1,
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontWeight: cookTime === option.value ? "600" : "400", color: cookTime === option.value ? "#EA580C" : "#374151", fontSize: "0.85rem" }}>
                        {option.label}
                      </div>
                      {option.desc && (
                        <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>
                          {option.desc}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Servings */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  👥 Serving Size
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: "any", label: "Any" },
                    { value: "small", label: "1-2 People" },
                    { value: "medium", label: "3-4 People" },
                    { value: "large", label: "5+ People" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setServings(option.value)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: servings === option.value ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: servings === option.value ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "0.85rem",
                        fontWeight: servings === option.value ? "600" : "400",
                        color: servings === option.value ? "#EA580C" : "#374151"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateDinner}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#EA580C",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                🎲 Generate Dinner Idea
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FED7AA",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#C2410C", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🍽️ Your Dinner Idea
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {noResults ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>😕</p>
                  <p style={{ margin: 0, fontWeight: "600" }}>No recipes found</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>Try adjusting your filters</p>
                </div>
              ) : !generatedRecipe ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>🍽️</p>
                  <p style={{ margin: 0 }}>Set your preferences and click Generate</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>We&apos;ll pick a delicious dinner for you!</p>
                </div>
              ) : (
                <div>
                  {/* Recipe Card */}
                  <div style={{
                    backgroundColor: "#FFF7ED",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #FED7AA",
                    marginBottom: "16px"
                  }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "2rem" }}>{generatedRecipe.emoji}</span>
                          <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                            {generatedRecipe.name}
                          </h3>
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{
                            padding: "4px 10px",
                            backgroundColor: "#EA580C",
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "500"
                          }}>
                            {cuisineLabels[generatedRecipe.cuisine]?.emoji} {cuisineLabels[generatedRecipe.cuisine]?.label || generatedRecipe.cuisine}
                          </span>
                          <span style={{
                            padding: "4px 10px",
                            backgroundColor: getDifficultyColor(generatedRecipe.difficulty),
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            textTransform: "capitalize"
                          }}>
                            {generatedRecipe.difficulty}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        style={{
                          padding: "8px 14px",
                          backgroundColor: copied ? "#10B981" : "#EA580C",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        {copied ? "✓ Copied!" : "📋 Copy"}
                      </button>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>⏱️</span>
                        <span style={{ fontSize: "0.9rem", color: "#57534E" }}>{generatedRecipe.cookTime} minutes</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>👥</span>
                        <span style={{ fontSize: "0.9rem", color: "#57534E" }}>Serves {generatedRecipe.servings}</span>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                        📝 Ingredients
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                        {generatedRecipe.ingredients.map((ingredient, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "0.85rem",
                              color: "#57534E"
                            }}
                          >
                            <span style={{ color: "#EA580C" }}>•</span>
                            <span>{ingredient}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ marginTop: "16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {generatedRecipe.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "4px 10px",
                            backgroundColor: "#F5F5F4",
                            color: "#57534E",
                            borderRadius: "4px",
                            fontSize: "0.75rem"
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Generate Another Button */}
                  <button
                    onClick={generateDinner}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "transparent",
                      color: "#EA580C",
                      border: "2px dashed #FED7AA",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    🔄 Generate Another Dinner Idea
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FED7AA", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🍽️ End the &quot;What&apos;s for Dinner?&quot; Dilemma
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  We&apos;ve all been there – standing in front of the fridge, staring blankly, wondering what to make for dinner. 
                  Decision fatigue is real, especially after a long day. Our Random Dinner Generator takes the stress out of 
                  meal planning by suggesting delicious recipes based on your preferences.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Use a Random Dinner Generator?</h3>
                <div style={{
                  backgroundColor: "#FFF7ED",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FED7AA"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Break the routine:</strong> Discover new dishes you might never have tried</li>
                    <li><strong>Save time:</strong> No more endless scrolling through recipe sites</li>
                    <li><strong>Reduce food waste:</strong> Plan meals around what you have</li>
                    <li><strong>Family friendly:</strong> Let the generator settle dinner debates</li>
                    <li><strong>Dietary options:</strong> Filter for vegetarian, vegan, or healthy meals</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Meal Planning</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🗓️ Plan Ahead</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      Generate ideas for the whole week and make one grocery trip
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🥗 Balance Your Meals</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      Mix comfort food with healthy options throughout the week
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>⏱️ Consider Time</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      Save longer recipes for weekends, quick meals for busy weeknights
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🌍 Explore Cuisines</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      Try a different cuisine each night for variety
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Stats */}
            <div style={{ backgroundColor: "#EA580C", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📊 Recipe Collection</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>🍽️ 75+ dinner recipes</p>
                <p style={{ margin: 0 }}>🌍 7 cuisines</p>
                <p style={{ margin: 0 }}>🥬 Vegetarian options</p>
                <p style={{ margin: 0 }}>⚡ Quick & easy meals</p>
                <p style={{ margin: 0 }}>💚 Healthy choices</p>
              </div>
            </div>

            {/* Popular Cuisines */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🌍 Cuisines Available</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 4px 0" }}>🇺🇸 American classics</p>
                <p style={{ margin: "0 0 4px 0" }}>🇮🇹 Italian favorites</p>
                <p style={{ margin: "0 0 4px 0" }}>🇲🇽 Mexican dishes</p>
                <p style={{ margin: "0 0 4px 0" }}>🥢 Asian cuisine</p>
                <p style={{ margin: "0 0 4px 0" }}>🇮🇳 Indian curry</p>
                <p style={{ margin: "0 0 4px 0" }}>🫒 Mediterranean</p>
                <p style={{ margin: 0 }}>🍟 Fast food style</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/random-dinner-generator" currentCategory="Entertainment" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FED7AA", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px", border: "1px solid #FED7AA" }}>
          <p style={{ fontSize: "0.75rem", color: "#C2410C", textAlign: "center", margin: 0 }}>
            🍽️ <strong>Note:</strong> Ingredient quantities are approximate. Adjust based on your preferences and dietary needs. 
            Always check for food allergies before cooking.
          </p>
        </div>
      </div>
    </div>
  );
}