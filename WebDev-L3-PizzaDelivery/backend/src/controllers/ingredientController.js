import Ingredient from '../models/Ingredient.js';

// GET /api/ingredients — public
export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ isActive: true }).sort('category name');
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/inventory — admin
export const getInventory = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort('category name');
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/inventory/:id — admin
export const updateStock = async (req, res) => {
  try {
    const { stock, lowStockThreshold, name, price } = req.body;
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });

    if (stock !== undefined) {
      if (stock < 0) return res.status(400).json({ message: 'Stock cannot be negative' });
      ingredient.stock = stock;
      // Reset alert flag if stock is back above threshold
      if (stock >= ingredient.lowStockThreshold) {
        ingredient.lowStockAlertSent = false;
      }
    }
    if (lowStockThreshold !== undefined) ingredient.lowStockThreshold = lowStockThreshold;
    if (name !== undefined) ingredient.name = name;
    if (price !== undefined) ingredient.price = price;

    await ingredient.save();
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/inventory — admin: add ingredient
export const addIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
