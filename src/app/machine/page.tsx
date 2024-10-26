"use client";
import { useContext } from "react";
import CartContextProvider, { CartContext } from "@/contexts/cart-context";
import ProductListContextProvider, { ProductListContext } from "@/contexts/product-context";
import { Product } from "@/types/cart-and-products";
import { MachineContext, MachineContextProvider } from "@/contexts/machine-context";
import { State } from "@/types/machine";
import { send } from "process";

export default function Machine() {

  return (
    <ProductListContextProvider>
      <CartContextProvider>
        <MachineContextProvider>
          <MainDisplay />
        </MachineContextProvider>
      </CartContextProvider>
    </ProductListContextProvider>
  );
}

function MainDisplay() {
  const { state } = useContext(MachineContext);

  function getCurrentDisplay() {
    switch(state) {
      case State.SHOPPING: return <ShoppingDisplay />;
      case State.DELIVERY: return <DeliveryDisplay />;
      case State.PAYMENT: return <PaymentDisplay />;
      case State.REVIEW: return <ReviewDisplay />;
      case State.CONFIRM: return <ConfirmDisplay />;
      case State.SEND_ORDER: return <LoadingDisplay />;
      case State.SEND_ORDER_FAILURE: return <LoadingDisplay />;
      case State.ERROR: return <ErrorDisplay />;
      default: return <ShoppingDisplay />;
    }
  }

  return (
    <>{getCurrentDisplay()}</>
  );
}

function ShoppingDisplay() {
  const { updateState } = useContext(MachineContext);

  function handleCheckout() {
    updateState(State.DELIVERY);
  }

  return (
    <div className="shopping-view">
      <span className="product-view">
        <ProductListDisplay />
      </span>
      <span className="cart-view">
        <CartDisplay />
      </span>
      <span>
        <button onClick={handleCheckout} >Checkout</button>
      </span>
    </div>
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

function DeliveryDisplay() {
  const { updateState } = useContext(MachineContext);

  function handleNext() {
    updateState(State.PAYMENT);
  }

  function handleToShopping() {
    updateState(State.SHOPPING);
  }

  return (
    <div>
      <h2>Delivery Options</h2>
      <button onClick={handleNext} >Next</button>
      <button onClick={handleToShopping} >Back to Shopping</button>
    </div>
  );
}

function PaymentDisplay() {
  const { updateState } = useContext(MachineContext);

  function handleNext() {
    updateState(State.REVIEW);
  }

  function handleToShopping() {
    updateState(State.SHOPPING);
  }

  return (
    <div>
      <h2>Payment Options</h2>
      <button onClick={handleNext} >Next</button>
      <button onClick={handleToShopping} >Back to Shopping</button>
    </div>
  );
}

function ReviewDisplay() {
  const { products, subTotal } = useContext(CartContext);
  const { updateState } = useContext(MachineContext);

  function handleNext() {
    updateState(State.SEND_ORDER);
  }

  function handleToShopping() {
    updateState(State.SHOPPING);
  }

  function handleError() {
    updateState(State.SEND_ORDER_FAILURE);
  }

  return (
    <div>
      <h2>Review</h2>
      <h3>Cart</h3>
    <div>
      <p>Subtotal: ${subTotal.toFixed(2)}</p>
    </div>
    <div>
      {products.map((p) => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>${p.price}</p>
          <p>qty: {p.quantity}</p>
        </div>
      ))
      }
    </div>
      <button onClick={handleNext} >Submit</button>
      <button onClick={handleToShopping} >Back to Shopping</button>
      <button onClick={handleError} >Submit with Error</button>
    </div>
  );
}

function ConfirmDisplay() {
  const { updateState } = useContext(MachineContext);
  const { subTotal } = useContext(CartContext);

  function handleNext() {
    updateState(State.SHOPPING);
  }

  return (
    <div>
      <h2>Order Confirmed</h2>
      {/* <div>
        <p>Order ID: {state.context.orderId}</p>
      </div> */}
      <div>
        <p>Subtotal: ${subTotal.toFixed(2)}</p>
      </div>
      <button onClick={handleNext} >Next</button>
    </div>
  );
}

function ErrorDisplay() {
  const { updateState } = useContext(MachineContext);

  function handleContinue() {
    updateState(State.SHOPPING);
  }

  return (
    <div>
      <h2>Something Unexpected Occurred</h2>
      {/* {state.context.exception ? (<div>{state.context.exception}</div>) : (<></>)} */}
      <button onClick={handleContinue} >Back to Shopping</button>
    </div>
  );
}

function LoadingDisplay() {
  return (
    <div>
      <h2>LOADING...</h2>
    </div>
  );
}