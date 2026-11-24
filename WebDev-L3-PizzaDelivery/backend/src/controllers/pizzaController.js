import Pizza from '../models/Pizza.js';

export const getAllPizzas = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isAvailable: true };
    const pizzas = await Pizza.find(filter).sort({ createdAt: -1 });
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPizza = async (req, res) => {
  try {
    const { name, description, category, basePrice, image, ingredients, isActive, isAvailable } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    const pizza = await Pizza.create({
      name: name.trim(),
      description: description.trim(),
      category: category || 'veg',
      basePrice: Number(basePrice) || 299,
      image: image || 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80',
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      isActive: isActive !== undefined ? isActive : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });
    res.status(201).json(pizza);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json({ message: 'Pizza deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
