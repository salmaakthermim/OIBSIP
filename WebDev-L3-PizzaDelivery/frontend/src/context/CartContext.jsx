import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (pizza, size) => {
    const sizeInfo = pizza.sizes.find(s => s.size === size);
    const existing = cart.find(i => i.pizzaId === pizza._id && i.size === size);
    if (existing) {
      setCart(cart.map(i =>
        i.pizzaId === pizza._id && i.size === size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, {
        pizzaId: pizza._id,
        name: pizza.name,
        size,
        price: sizeInfo.price,
        quantity: 1,
        image: pizza.image,
      }]);
    }
  };

  const removeFromCart = (pizzaId, size) => {
    setCart(cart.filter(i => !(i.pizzaId === pizzaId && i.size === size)));
  };

  const updateQuantity = (pizzaId, size, quantity) => {
    if (quantity < 1) return removeFromCart(pizzaId, size);
    setCart(cart.map(i =>
      i.pizzaId === pizzaId && i.size === size ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
