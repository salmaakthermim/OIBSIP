import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Ingredient from '../models/Ingredient.js';
import User from '../models/User.js';
import Pizza from '../models/Pizza.js';

dotenv.config();

const defaultPizzas = [
  {
    name: 'Margherita Classic',
    description: 'Fresh tomato, mozzarella & aromatic basil',
    category: 'veg',
    basePrice: 299,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80',
    ingredients: ['Thin Crust', 'Tomato Basil', 'Mozzarella', 'Cherry Tomatoes'],
    isActive: true,
  },
  {
    name: 'BBQ Chicken',
    description: 'Smoky BBQ sauce with seasoned grilled chicken and onion',
    category: 'non-veg',
    basePrice: 399,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80',
    ingredients: ['Thick Crust', 'BBQ Sauce', 'Cheddar', 'Onions'],
    isActive: true,
  },
  {
    name: 'Veggie Supreme',
    description: 'Loaded with fresh garden vegetables, bell peppers and olives',
    category: 'veg',
    basePrice: 349,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80',
    ingredients: ['Whole Wheat Crust', 'Tomato Basil', 'Mozzarella', 'Bell Peppers', 'Mushrooms', 'Olives'],
    isActive: true,
  },
  {
    name: 'Pepperoni Feast',
    description: 'Double beef pepperoni with melted mozzarella and oregano',
    category: 'non-veg',
    basePrice: 449,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80',
    ingredients: ['Cheese Burst Crust', 'Tomato Basil', 'Mozzarella', 'Jalapenos'],
    isActive: true,
  },
];

const ingredients = [
  // 5 Bases
  { name: 'Thin Crust', category: 'base', price: 50, stock: 100, lowStockThreshold: 20 },
  { name: 'Thick Crust', category: 'base', price: 60, stock: 100, lowStockThreshold: 20 },
  { name: 'Cheese Burst Crust', category: 'base', price: 80, stock: 80, lowStockThreshold: 20 },
  { name: 'Whole Wheat Crust', category: 'base', price: 70, stock: 90, lowStockThreshold: 20 },
  { name: 'Gluten Free Crust', category: 'base', price: 90, stock: 60, lowStockThreshold: 20 },

  // 5 Sauces
  { name: 'Tomato Basil', category: 'sauce', price: 30, stock: 150, lowStockThreshold: 25 },
  { name: 'BBQ Sauce', category: 'sauce', price: 35, stock: 120, lowStockThreshold: 25 },
  { name: 'Pesto', category: 'sauce', price: 40, stock: 100, lowStockThreshold: 25 },
  { name: 'Garlic White Sauce', category: 'sauce', price: 38, stock: 110, lowStockThreshold: 25 },
  { name: 'Spicy Arrabiata', category: 'sauce', price: 32, stock: 130, lowStockThreshold: 25 },

  // Cheese options
  { name: 'Mozzarella', category: 'cheese', price: 60, stock: 200, lowStockThreshold: 30 },
  { name: 'Cheddar', category: 'cheese', price: 55, stock: 180, lowStockThreshold: 30 },
  { name: 'Parmesan', category: 'cheese', price: 70, stock: 150, lowStockThreshold: 30 },
  { name: 'Gouda', category: 'cheese', price: 65, stock: 160, lowStockThreshold: 30 },

  // Vegetables
  { name: 'Bell Peppers', category: 'vegetable', price: 20, stock: 200, lowStockThreshold: 30 },
  { name: 'Mushrooms', category: 'vegetable', price: 25, stock: 180, lowStockThreshold: 30 },
  { name: 'Olives', category: 'vegetable', price: 30, stock: 160, lowStockThreshold: 30 },
  { name: 'Onions', category: 'vegetable', price: 15, stock: 220, lowStockThreshold: 30 },
  { name: 'Jalapenos', category: 'vegetable', price: 25, stock: 140, lowStockThreshold: 30 },
  { name: 'Cherry Tomatoes', category: 'vegetable', price: 28, stock: 170, lowStockThreshold: 30 },
  { name: 'Spinach', category: 'vegetable', price: 20, stock: 190, lowStockThreshold: 30 },
  { name: 'Corn', category: 'vegetable', price: 18, stock: 210, lowStockThreshold: 30 },
];

export const seedDatabase = async () => {
  try {
    const ingredientCount = await Ingredient.countDocuments();
    if (ingredientCount === 0) {
      await Ingredient.insertMany(ingredients);
      console.log(`[SEED] Seeded ${ingredients.length} ingredients`);
    } else {
      console.log('[SEED] Ingredients already seeded, skipping.');
    }

    // Create default admin if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@pizzahub.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true,
      });
      await adminUser.save();
      console.log('[SEED] Default admin created: admin@pizzahub.com / admin123');
    }

    // Seed default pizzas if not exist
    const pizzaCount = await Pizza.countDocuments();
    if (pizzaCount === 0) {
      await Pizza.insertMany(defaultPizzas);
      console.log(`[SEED] Seeded ${defaultPizzas.length} pizzas`);
    } else {
      console.log('[SEED] Pizzas already seeded, skipping.');
    }
  } catch (err) {
    console.error('[SEED] Error:', err.message);
  }
};
