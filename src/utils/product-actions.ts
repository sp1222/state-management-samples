import { Product } from "@/types/cart-and-products";

export async function initProductList() {
  const init: Product[] = [];
  init.push({ id: 1, name: "bananas", price: 0.46, disabled: false });
  init.push({ id: 2, name: "apples", price: 0.52, disabled: false });
  init.push({ id: 3, name: "mushrooms", price: 1.23, disabled: false });
  init.push({ id: 4, name: "carrots", price: 0.18, disabled: false });
  init.push({ id: 5, name: "onions", price: 0.12, disabled: false });
  return new Promise((resolve) => {
    setTimeout(() => { resolve(init); }, 500);
  });
}

export function toggleProductDisabled(products: Product[], id: number, disabled: boolean) {
  return products.map(p => {
    if (p.id === id) p.disabled = disabled;
    return p;
  });
}