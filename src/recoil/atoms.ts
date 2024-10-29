import { Product, Cart } from "@/types/cart-and-products";
import { initProductList, toggleProductDisabled } from "@/utils/product-actions";
import { atom, selector } from "recoil";

export const productListState = atom<Product[]>({
  key: "productListState",
  default: selector({
    key: "initialProductList",
    get: async () => {
      const products = await initProductList();
      return products as Product[];
    },
  }),
});

export const productLoadingState = atom<boolean>({
  key: "productLoadingState",
  default: true,
});

export const cartState = atom<Cart>({
  key: "cartState",
  default: { products: [], subTotal: 0 },
});

export const toggleDisabledSelector = selector({
  key: 'ToggleDisabledSelector',
  get: ({ get }) => get(productListState),
  // set: ({ get, set }, { id, disabled }: { id: number, disabled: boolean }) => {
  //   const currentProductList = get(productListState);
  //   const updatedProductList = currentProductList.map((product) =>
  //     product.id === id ? { ...product, disabled } : product
  //   );
  //   set(productListState, updatedProductList);
  // },
});