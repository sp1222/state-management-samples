import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/redux/cart-slice";
import productReducer from "@/redux/product-slice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;