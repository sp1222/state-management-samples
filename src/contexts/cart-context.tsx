"use client";
import { Cart, Product, ProductInCart } from "@/types/cart-and-products";
import React, { createContext, useContext, useState } from "react";
import { ProductListContext } from "./product-context";
import { addProductToCart, removeProductFromCart, incrementProductInCart, decrementProductFromCart, clearProductsInCart } from "@/utils/cart-actions";

// context data type
// defines the structure of the context that will be shared via CartContext
interface CartContextType extends Cart {
  addToCart: (product: Product) => void,
  removeFromCart: (id: number) => void,
  increment: (id: number) => void,
  decrement: (id: number) => void,
  clearCart: () => void,
}

// initialize the context
// provides some initial state, used as a placeholder for CartContextProvider
export const CartContext = createContext<CartContextType>({
  products: [] as ProductInCart[],
  subTotal: 0.00,
  addToCart: () => { },
  removeFromCart: () => { },
  increment: () => { },
  decrement: () => { },
  clearCart: () => { },
});

// define the context provider
// Provides states and methods to listeners
export function CartContextProvider({ children }: { children: React.ReactNode }) {
  const [activeCart, setActiveCart] = useState<Cart>({
    products: [] as ProductInCart[],
    subTotal: 0.00
  });
  const { toggleDisabled } = useContext(ProductListContext);

  function addToCart(product: Product) {
    setActiveCart(addProductToCart(activeCart, product));
    toggleDisabled(product.id, true);
  }

  function removeFromCart(id: number) {
    setActiveCart(removeProductFromCart(activeCart, id));
    toggleDisabled(id, false);
  }

  function increment(id: number) {
    setActiveCart(incrementProductInCart(activeCart, id));
  }

  function decrement(id: number) {
    const updatedCart = decrementProductFromCart(activeCart, id);
    if (!updatedCart.products.map(p => p.id).includes(id)) toggleDisabled(id, false);
    setActiveCart(updatedCart);
  }

  function clearCart() {
    activeCart.products.forEach(p => toggleDisabled(p.id, false));
    setActiveCart(clearProductsInCart());
  }

  // properties to make available to the listeners
  const value = {
    products: activeCart.products,
    subTotal: activeCart.subTotal,
    addToCart,
    removeFromCart,
    increment,
    decrement,
    clearCart,
  };

  return (
    <CartContext.Provider value={value} > {children} </CartContext.Provider>
  );
};

export default CartContextProvider;