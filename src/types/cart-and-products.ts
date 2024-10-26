export interface Product {
  id: number,
  name: string,
  price: number,
  disabled: boolean,
}

export interface ProductInCart extends Product {
  quantity: number,
}

export interface Cart {
  products: ProductInCart[],
  subTotal: number,
}