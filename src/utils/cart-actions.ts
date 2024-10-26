import { Cart, Product, ProductInCart } from "@/types/cart-and-products";

export function addProductToCart(cart: Cart, product: Product) {
  const subTotal = cart.subTotal + product.price;
  return {
    ...cart,
    products: [
      ...cart.products,
      {
        ...product,
        quantity: 1,
      }
    ],
    subTotal: Math.round(subTotal * 100) / 100,
  };
}

export function removeProductFromCart(cart: Cart, id: number) {
  let subTotal = cart.subTotal;
  cart.products.forEach(p => {
    if (p.id === id) {
      subTotal -= (p.price * p.quantity);
    }
  })
  return {
    ...cart,
    products: cart.products.filter(p => p.id !== id),
    subTotal: Math.round(subTotal * 100 )/ 100,
  };
}

export function incrementProductInCart(cart: Cart, id: number) {
  let subTotal = cart.subTotal;
  const updatedProducts = cart.products.map(p => {
    if (p.id === id) {
      subTotal += p.price;
      return { ...p, quantity: p.quantity + 1 };
    }
    return p;
  });
  return {
    ...cart,
    products: updatedProducts,
    subTotal: Math.round(subTotal * 100) / 100,
  };
}

export function decrementProductFromCart(cart: Cart, id: number) {
  let subTotal = cart.subTotal;
  const updatedProducts = cart.products.map(p => {
    if (p.id === id) {
      subTotal -= p.price;
      return { ...p, quantity: p.quantity - 1 };
    }
    return p;
  });
  return {
    ...cart,
    products: updatedProducts.filter(p => p.quantity > 0),
    subTotal: Math.round(subTotal * 100) / 100
  };
}

export function clearProductsInCart() {
  return {
    products: [] as ProductInCart[],
    subTotal: 0.00,
  };
}
