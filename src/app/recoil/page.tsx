"use client";
import { productListState, cartState, loadingState } from "@/recoil/atoms";
import { Cart, Product } from "@/types/cart-and-products";
import { initProductList } from "@/utils/product-actions";
import { useEffect } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";

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
  const [productList, setProductList] = useRecoilState<Product[]>(productListState);
  const [isLoading, setLoading] = useRecoilState(loadingState);

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


  const onAddToCart = (id: number) => {
    console.log(id);
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
  const cart = useRecoilValue<Cart>(cartState);

  const onIncrement = (id: number) => {
    console.log(id);
  }

  const onDecrement = (id: number) => {
    console.log(id);
  }

  const onRemoveFromCart = (id: number) => {
    console.log(id);
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