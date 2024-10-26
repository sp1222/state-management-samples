"use client";
import { useContext } from "react";
import CartContextProvider, { CartContext } from "@/contexts/cart-context";
import ProductListContextProvider, { ProductListContext } from "@/contexts/product-context";
import { Product } from "@/types/cart-and-products";

export default function Global() {
  return (
    <ProductListContextProvider>
      <CartContextProvider>
        <div className="shopping-view">
          <span className="product-view">
            <ProductListDisplay />
          </span>
          <span className="cart-view">
            <CartDisplay />
          </span>
        </div>
      </CartContextProvider>
    </ProductListContextProvider>
  );
}

function ProductListDisplay() {
  const { addToCart } = useContext(CartContext);
  const { loading, productList } = useContext(ProductListContext);

  const onAddToCart = (product: Product) => addToCart(product);

  return <div>
    <h2>Products</h2>
    {!loading ? (productList.map((product) => (
      <div key={product.id}>
        <h3>{product.name}</h3>
        <p>${product.price}</p>
        <button onClick={() => onAddToCart(product)} disabled={product.disabled}>{product.disabled ? "In Cart" : "Add"}</button>
      </div>
    ))) : <p>Loading Products</p>
    }
  </div>;
}

function CartDisplay() {
  const { products, subTotal, removeFromCart, increment, decrement } = useContext(CartContext);

  const onIncrement = (id: number) => increment(id);
  const onDecrement = (id: number) => decrement(id);
  const onRemoveFromCart = (id: number) => removeFromCart(id);

  return <div>
    <h2>Cart</h2>
    <div>
      <p>Subtotal: ${subTotal.toFixed(2)}</p>
    </div>
    <div>
      {products.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>${p.price}</p>
          <p>qty: {p.quantity}</p>
          <button onClick={() => onIncrement(p.id)} >+</button>
          <button onClick={() => onDecrement(p.id)} >-</button>
          <button onClick={() => onRemoveFromCart(p.id)} >Remove</button>
        </div>
      ))
      }
    </div>
  </div>;
}