"use client";
import { Cart, Product } from "@/types/cart-and-products";
import { useEffect, useState } from "react";
import { addProductToCart, decrementProductFromCart, incrementProductInCart, removeProductFromCart } from "@/utils/cart-actions"
import { initProductList } from "@/utils/product-actions";

export default function Local() {
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);
  const [activeCart, setActiveCart] = useState<Cart>({ products: [], subTotal: 0.0 });

  // initialize product list
  useEffect(() => {
    async function getProducts() {
      return await initProductList();
    }
    getProducts().then(products => {
      setProductList(products as Product[]);
      setLoading(false);
    });
  }, []);

  // toggle disabling products in product list on cart change
  useEffect(() => {
    const cartIds = activeCart.products.map(p => p.id);
    setProductList(prev => {
      return prev.map(p => {
        if (cartIds.includes(p.id)) p.disabled = true;
        else p.disabled = false;
        return p;
      });
    });
  }, [activeCart]);

  const addToCart = (product: Product) => setActiveCart(addProductToCart(activeCart, product));
  const removeFromCart = (id: number) => setActiveCart(removeProductFromCart(activeCart, id));
  const increment = (id: number) => setActiveCart(incrementProductInCart(activeCart, id));
  const decrement = (id: number) => setActiveCart(decrementProductFromCart(activeCart, id));

  return (
    <div className="shopping-view">
      <span className="product-view">
        <ProductListDisplay loading={loading} productList={productList} addToCart={addToCart} />
      </span>
      <span className="cart-view">
        <CartDisplay cart={activeCart} increment={increment} decrement={decrement} removeFromCart={removeFromCart} />
      </span>
    </div>
  );
}

function ProductListDisplay({
  loading,
  productList,
  addToCart
}: {
  loading: boolean,
  productList: Product[];
  addToCart: (product: Product) => void;
}) {
  const onAddToCart = (product: Product) => addToCart(product);

  return <div>
    <h2>Products</h2>
    {!loading ? (productList.map((product) => (
      <div key={product.id}>
        <h3>{product.name}</h3>
        <p>${product.price}</p>
        <button onClick={() => onAddToCart(product)} disabled={product.disabled}>
          {product.disabled ? "In Cart" : "Add"}
        </button>
      </div>
    ))) : <p>Loading Products</p>
    }
  </div>;
}

function CartDisplay({
  cart,
  increment,
  decrement,
  removeFromCart
}: {
  cart: Cart,
  increment: (id: number) => void;
  decrement: (id: number) => void;
  removeFromCart: (id: number) => void;
}) {

  const onIncrement = (id: number) => increment(id);
  const onDecrement = (id: number) => decrement(id);
  const onRemoveFromCart = (id: number) => removeFromCart(id);

  return <div>
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
          <button onClick={() => onIncrement(p.id)} >+</button>
          <button onClick={() => onDecrement(p.id)} >-</button>
          <button onClick={() => onRemoveFromCart(p.id)} >Remove</button>
        </div>
      ))
      }
    </div>
  </div>;
}
