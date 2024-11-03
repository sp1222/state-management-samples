"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, store } from "@/redux/redux-store";
import { fetchProducts, toggleDisabled } from "@/redux/product-slice";
import { addToCart, removeFromCart, decrement, increment } from "@/redux/cart-slice";
import { Product } from "@/types/cart-and-products";
import { Provider } from "react-redux";

export default function Redux() {
  return (
    <Provider store={store}>
      <div className="shopping-view">
        <span className="product-view">
          <ProductListDisplay />
        </span>
        <span className="cart-view">
          <CartDisplay />
        </span>
      </div>
    </Provider>
  );
}

function ProductListDisplay() {
  const productList: Product[] = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state: RootState) => state.products.loading);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onAddToCart = (product: Product) => {
    if (!loading) {
      dispatch(addToCart(product));
      dispatch(toggleDisabled(product));
    }
  }

  return (
    <div>
      <h2>Products</h2>
      {!loading ? (productList.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button onClick={() => onAddToCart(product)} disabled={product.disabled}>
            {product.disabled ? "In Cart" : "Add"}
          </button>
        </div>
      ))) : <p>Loading Products</p>}
    </div>
  );
}

function CartDisplay() {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch: AppDispatch = useDispatch();

  const onIncrement = (id: number) => dispatch(increment(id));
  const onDecrement = (id: number) => {
    // TODO: fixme, toggleDisabled does not go to false as expected
    if (cart.products.find(p => p.id === id).quantity === 1 || 0) toggleDisabled({id: id, disabled: false} as Product);
    dispatch(decrement(id));
  }
  const onRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id));
    toggleDisabled({id: id, disabled: false} as Product);
  }

  return (
    <div>
      <h2>Cart</h2>
      <div>
        <p>Subtotal: ${cart.subTotal.toFixed(2)}</p>
      </div>
      <div>
        {cart.products.map(p => (
          <div key={p.id}>
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <p>qty: {p.quantity}</p>
            <button onClick={() => onIncrement(p.id)}>+</button>
            <button onClick={() => onDecrement(p.id)}>-</button>
            <button onClick={() => onRemoveFromCart(p.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}