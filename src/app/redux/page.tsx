"use client";
import { useEffect, useState } from "react";
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

  const addToCartHandler = (product: Product) => {
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
          <button onClick={() => addToCartHandler(product)} disabled={product.disabled}>{product.disabled ? "In Cart" : "Add"}</button>
        </div>
      ))) : <p>Loading Products</p>}
    </div>
  );
}

function CartDisplay() {
  const cart = useSelector((state: RootState) => state.cart); // Available because of the Provider
  const dispatch: AppDispatch = useDispatch();
  const [lastDecremented, setLastDecremented] = useState<number>(-1);

  useEffect(() => {
    if (cart && dispatch && lastDecremented){
      if (lastDecremented !== -1 && !cart.products.map(p => p.id).includes(lastDecremented)) {
        dispatch(toggleDisabled({id: lastDecremented, disabled: true} as Product));
        setLastDecremented(-1);
      }
    }
  }, [cart, dispatch, lastDecremented]);

  const incrementHandler = (id: number) => dispatch(increment(id));
  const decrementHandler = (id: number) => {
    dispatch(decrement(id));
    setLastDecremented(id);
  }
  const removeHandler = (id: number) => {
    dispatch(removeFromCart(id));
    setLastDecremented(id);
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
            <button onClick={() => incrementHandler(p.id)}>+</button>
            <button onClick={() => decrementHandler(p.id)}>-</button>
            <button onClick={() => removeHandler(p.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}