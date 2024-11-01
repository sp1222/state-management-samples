import { addProductToCart, removeProductFromCart, incrementProductInCart, decrementProductFromCart } from "@/utils/cart-actions";
import { selector, selectorFamily } from "recoil";
import { productListState, cartState } from "./atoms";
import { Product } from "@/types/cart-and-products";
import { initProductList } from "@/utils/product-actions";


// A selector represents a piece of derived state
// not parameterized
// Derived state is the output of passing state to a pure function that derives a new value from the said state
// Derived state is a powerful concept because it lets us build dynamic data that depends on other data
export const productListSelector = selector<Product[]>({
  key: "ProductListSelector",
  get: async () => {
    const products = await initProductList();
    return products;
  },
});

// A selectorFamily is a powerful pattern that is similar to a selector, 
// but allows you to pass parameters to the get and set callbacks of a selector. 
// The selectorFamily() utility returns a function which can be called with user-defined parameters and returns a selector. 
// Each unique parameter value will return the same memoized selector instance.
export const toggleDisabledSelector = selectorFamily({
  key: 'ToggleDisabledSelector',
  get: (id: number) => ({ get }) => {
    const productList = get(productListState);
    return productList.find(product => product.id === id)?.disabled || false;
  },
  set: (id: number) => ({ get, set }, newDisabled) => {
    const productList = get(productListState);
    const updatedProductList = productList.map(product =>
      product.id === id ? { ...product, disabled: newDisabled as boolean } : product
    );
    set(productListState, updatedProductList);
  },
});

export const addToCartSelector = selectorFamily<void, number>({
  key: 'AddToCartSelector',
  get: () => () => {
    return;
  },
  set: (productId: number) => ({ get, set }) => {
    const cart = get(cartState);
    const products = get(productListState);

    const product = products.find((p) => p.id === productId);

    if (product) {
      const newCart = addProductToCart(cart, product);
      set(cartState, newCart);
      set(toggleDisabledSelector(product.id), true);
    } else {
      console.warn(`Product with ID ${productId} not found.`);
    }
  },
});

export const removeFromCartSelector = selectorFamily<void, number>({
  key: 'RemoveFromCartSelector',
  get: () => () => {
    return;
  },
  set: (id: number) => ({ get, set }) => {
    const cart = get(cartState);
    const newCart = removeProductFromCart(cart, id);
    set(cartState, newCart);
    set(toggleDisabledSelector(id), false);
  },
});

export const incrementSelector = selectorFamily<void, number>({
  key: 'IncrementSelector',
  get: () => () => {
    return;
  },
  set: (id: number) => ({ get, set }) => {
    const cart = get(cartState);
    set(cartState, incrementProductInCart(cart, id));
  },
});

export const decrementSelector = selectorFamily<void, number>({
  key: 'DecrementSelector',
  get: () => () => {
    return;
  },
  set: (id: number) => ({ get, set }) => {
    const cart = get(cartState);
    const newCart = decrementProductFromCart(cart, id);
    set(cartState, newCart);
    if (!newCart.products.find(p => p.id === id)) set(toggleDisabledSelector(id), false);
  },
});
