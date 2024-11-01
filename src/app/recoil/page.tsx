"use client";
import { productListState, cartState, loadingState } from "@/recoil/atoms";
import { addToCartSelector } from "@/recoil/selectors";
import { initProductList } from "@/utils/product-actions";
import { useEffect } from "react";
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

function ProductListDisplay() {
  const [productList, setProductList] = useRecoilState(productListState);
  const [isLoading, setLoading] = useRecoilState(loadingState);
  const setAddToCart = useSetRecoilState(addToCartSelector(id));

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const products = await initProductList();
      setProductList(products);
      setLoading(false);
    };

    if (productList.length === 0) {
      getProducts();
    }
  }, [setLoading, setProductList, productList]);

  const addToCart = (productId: number) => {
    setAddToCart(productId); 
  };

  const onAddToCart = (productId: number) => {
    addToCart(productId);
  };

  return (
    <div>
      <h2>Products</h2>
      {!isLoading ? (
        productList.map((product) => {
          return (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button
                onClick={() => onAddToCart(product.id)}
                disabled={product.disabled}
              >
                {product.disabled ? "In Cart" : "Add"}
              </button>
            </div>
          );
        })
      ) : (
        <p>Loading Products</p>
      )}
    </div>
  );
}

function CartDisplay() {
  const cart = useRecoilValue(cartState);

  const onIncrement = (id: number) => {
  }

  const onDecrement = (id: number) => {
  }

  const onRemoveFromCart = (id: number) => {
  }

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