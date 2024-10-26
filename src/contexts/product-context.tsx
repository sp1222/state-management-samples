"use client";
import { createContext, useEffect, useState } from "react";
import { Product } from "@/types/cart-and-products";
import { initProductList, toggleProductDisabled } from "@/utils/product-actions";

// context data type
// defines the structure of the context that will be shared via CartContext
interface ProductListContextType {
  loading: boolean,
  productList: Product[],
  toggleDisabled: (id: number, disabled: boolean) => void,
};

// initialize the context
// provides some initial state, used as a placeholder for CartContextProvider
export const ProductListContext = createContext<ProductListContextType>({
  loading: true,
  productList: [] as Product[],
  toggleDisabled: () => { },
});

// define the context provider
// Provides states and methods to listeners
export function ProductListContextProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [productList, setProductList] = useState<Product[]>([]);

  // initialize product list
  useEffect(() => {
    async function getProducts() {
      return await initProductList();
    }
    getProducts().then(products => {
      setProductList(products as Product[]);
      setLoading(false);
    });
  }, []);

  function toggleDisabled(id: number, disabled: boolean) {
    setProductList(toggleProductDisabled(productList, id, disabled));
  }

  // properties to make available to the listeners
  const value = {
    loading: loading,
    productList: productList,
    toggleDisabled: toggleDisabled,
  };

  return (
    <ProductListContext.Provider value={value}>{children}</ProductListContext.Provider>
  );
}

export default ProductListContextProvider;