import { atom } from 'recoil';
import { Product, Cart, ProductInCart } from '@/types/cart-and-products';

// Atoms contain the source of truth for our application state

export const productListState = atom<Product[]>({
  key: 'ProductListState',
  default: [] as Product[],
});

export const loadingState = atom<boolean>({
  key: "loadingState",
  default: true,
});

export const cartState = atom<Cart>({
  key: 'CartState',
  default: { products: [] as ProductInCart[], subTotal: 0.00 },
});
