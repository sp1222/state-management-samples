import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/cart-and-products";
import { initProductList, toggleProductDisabled } from "@/utils/product-actions";

interface ProductState {
  loading: boolean;
  products: Product[];
}

const initialState: ProductState = {
  loading: true,
  products: [] as Product[],
};

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const products = await initProductList();
  return products as Product[];
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    toggleDisabled: (state, payload: PayloadAction<Product>) => {
      const updatedProducts = toggleProductDisabled(state.products, payload.payload.id, !payload.payload.disabled);
      state.products = updatedProducts;
    },
  },
  // extraReducers are typically used to update the slices own state in response to other action types besides the types it has generated
  // , such as by createAsyncThunk
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, payload) => {
      state.products = payload.payload;
      state.loading = false;
    });
  }
});

export const { toggleDisabled } = productSlice.actions;
export default productSlice.reducer;
