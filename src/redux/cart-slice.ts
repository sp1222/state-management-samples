import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart, Product, ProductInCart } from "@/types/cart-and-products";
import { addProductToCart, removeProductFromCart, incrementProductInCart, decrementProductFromCart } from "@/utils/cart-actions";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [] as ProductInCart[],
    subTotal: 0.0,
  } as Cart,
  reducers: {
    addToCart: (state, payload: PayloadAction<Product>) => {
      const updatedCart = addProductToCart(state, payload.payload);
      state.products = updatedCart.products;
      state.subTotal = updatedCart.subTotal;
    },
    removeFromCart: (state, payload: PayloadAction<number>) => {
      const updatedCart = removeProductFromCart(state, payload.payload);
      state.products = updatedCart.products;
      state.subTotal = updatedCart.subTotal;
    },
    increment: (state, payload: PayloadAction<number>) => {
      const updatedCart = incrementProductInCart(state, payload.payload);
      state.products = updatedCart.products;
      state.subTotal = updatedCart.subTotal;
    },
    decrement: (state, payload: PayloadAction<number>) => {
      const updatedCart = decrementProductFromCart(state, payload.payload);
      state.products = updatedCart.products;
      state.subTotal = updatedCart.subTotal;
    }
  },
});

export const { addToCart, removeFromCart, increment, decrement } = cartSlice.actions;
export default cartSlice.reducer;