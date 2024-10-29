"use client";
import { productListState, productLoadingState, cartState, toggleDisabledSelector } from "@/recoil/atoms";
import { toggleDisabled } from "@/redux/product-slice";
import { Product } from "@/types/cart-and-products";
import { addProductToCart, decrementProductFromCart, incrementProductInCart, removeProductFromCart } from "@/utils/cart-actions";
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function Recoil() {
  return (
    <RecoilRoot>
      <div className="shopping-view">
        <span className="product-view">
          <ProductListDisplay />
        </span>
        <span className="cart-view">
          <CartDisplay />
        </span>
      </div>
    </RecoilRoot>
  );
}

export function ProductListDisplay() {
  const productList = useRecoilValue(productListState);
  const loading = useRecoilValue(productLoadingState);
  const setCart = useSetRecoilState(cartState);
  // const toggleDisabled = useSetRecoilState(toggleDisabledSelector);

  const onAddToCart = (product: Product) => {
    setCart((cart) => addProductToCart(cart, product));
    toggleDisabled({ id: product.id, disabled: true });
  };

  return (
    <div>
      <h2>Products</h2>
      {!loading ? (
        productList.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => onAddToCart(product)} disabled={product.disabled}>
              {product.disabled ? "In Cart" : "Add"}
            </button>
          </div>
        ))
      ) : (
        <p>Loading Products</p>
      )}
    </div>
  );
}

export function CartDisplay() {
  const [cart, setCart] = useRecoilState(cartState);
  // const toggleDisabled = useSetRecoilState(toggleDisabledSelector);

  const onIncrement = (id: number) => setCart((cart) => incrementProductInCart(cart, id));
  const onDecrement = (id: number) => {
    setCart((cart) => {
      const updatedCart = decrementProductFromCart(cart, id);
      // if (!updatedCart.products.some((p) => p.id === id)) toggleDisabled({ id, disabled: false });
      return updatedCart;
    });
  };

  const onRemoveFromCart = (id: number) => {
    setCart((cart) => removeProductFromCart(cart, id));
    // toggleDisabled({ id, disabled: false });
  };

  return (
    <div>
      <h2>Cart</h2>
      <div>
        <p>Subtotal: ${cart.subTotal.toFixed(2)}</p>
      </div>
      <div>
        {cart.products.map((p) => (
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