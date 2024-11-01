import { ProductInCart, Product } from "@/types/cart-and-products";
import { makeObservable, observable, computed, action } from "mobx";

class CartStore {

  products: ProductInCart[] = [];

  constructor() {
    this.products = [];
    makeObservable(this, {
      products: observable,
      subTotal: computed,
      addToCart: action,
      removeFromCart: action,
      increment: action,
      decrement: action,
    });
  }

  get subTotal(): number {
    return Math.round(this.products.reduce((acc, p) => acc + p.price * p.quantity, 0) * 100) / 100;
  }

  addToCart = (product: Product) => {
    this.products.push({ ...product, quantity: 1 });
  }

  removeFromCart = (id: number) => {
    this.products = this?.products.filter((p) => p.id !== id);
  }

  increment = (id: number) => {
    const product = this?.products.find((p) => p.id === id);
    if (product) {
      product.quantity++;
    }
  }

  decrement = (id: number) => {
    const product = this?.products.find((p) => p.id === id);
    if (product && product.quantity > 1) {
      product.quantity--;
    } else {
      this.removeFromCart(id);
    }
  }
}

export const cartStore = new CartStore();