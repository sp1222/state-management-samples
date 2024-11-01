"use client";
import { cartStore } from "@/mobx/cart-store";
import { productStore } from "@/mobx/product-store";
import { Product } from "@/types/cart-and-products";
import { observer } from "mobx-react";

const MobX = observer(() => {
  return (
    <div className="shopping-view">
      <span className="product-view">
        <ObservedProductListDisplay />
      </span>
      <span className="cart-view">
        <ObservedCartDisplay />
      </span>
    </div>
  );
});

const ObservedProductListDisplay = observer(ProductListDisplay);
const ObservedCartDisplay = observer(CartDisplay);

function ProductListDisplay() {
  const { addToCart, products } = cartStore;
  const { loading, productList, toggleDisabled } = productStore;

  const onAddToCart = (product: Product) => {
    console.log(JSON.parse(JSON.stringify(products)));
    addToCart(product);
    toggleDisabled(product.id, true);
  };

  return (
    <div>
      <h2>Products</h2>
      {!loading ? (
        productList.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => onAddToCart(product)} disabled={product.disabled}>{product.disabled ? "In Cart" : "Add"}</button>
          </div>
        ))
      ) : (
        <p>Loading Products</p>
      )}
    </div>
  );
}


function CartDisplay() {
  const { products, subTotal, removeFromCart, increment, decrement } = cartStore;
  const { toggleDisabled } = productStore;

  const onIncrement = (id: number) => increment(id);
  const onDecrement = (id: number) => {
    decrement(id);
  }
  const onRemoveFromCart = (id: number) => {
    removeFromCart(id);
    toggleDisabled(id, false);
  }

  return (
    <div>
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
        ))}
      </div>
    </div>
  );
}

export default MobX;