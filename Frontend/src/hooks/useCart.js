import { useEffect, useState } from 'react';

const CART_STORAGE_KEY = 'blinkit_cart';
const CART_UPDATED_EVENT = 'blinkit_cart_updated';

function readCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    return {};
  }

  try {
    return JSON.parse(storedCart);
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export default function useCart() {
  const [cart, setCart] = useState(() => readCart());

  useEffect(() => {
    const handleCartUpdate = () => {
      setCart(readCart());
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const getProductQuantity = (productId) => cart[productId]?.quantity || 0;

  const addToCart = (product) => {
    const latestCart = readCart();
    const productId = product.p_id ?? product.id;
    const amount = Number(product.price ?? product.amount ?? 0);
    const currentQuantity = latestCart[productId]?.quantity || 0;

    const updatedCart = {
      ...latestCart,
      [productId]: {
        id: productId,
        p_id: productId,
        name: product.name,
        amount,
        price: amount,
        image: product.image,
        quantity: currentQuantity + 1,
      },
    };

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const latestCart = readCart();
    const currentQuantity = latestCart[productId]?.quantity || 0;

    if (currentQuantity <= 1) {
      delete latestCart[productId];
      setCart({ ...latestCart });
      saveCart(latestCart);
      return;
    }

    const updatedCart = {
      ...latestCart,
      [productId]: {
        ...latestCart[productId],
        quantity: currentQuantity - 1,
      },
    };

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getProductQuantity,
  };
}
