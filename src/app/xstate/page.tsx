"use client";
import ProductListContextProvider, { ProductListContext } from "@/contexts/product-context";
import { Product } from "@/types/cart-and-products";
import { ShoppingMachineContext, ShoppingMachineContextProvider } from "@/xstate/shopping-machine-context";
import { useContext } from "react";

export default function XState() {
  return (
    <ProductListContextProvider>
      <ShoppingMachineContextProvider>
        <MainDisplay />
      </ShoppingMachineContextProvider>
    </ProductListContextProvider>
  );
}

function MainDisplay() {
  const { state } = useContext(ShoppingMachineContext);

  function getCurrentDisplay() {
    switch(state.value) {
      case "shopping": return <ShoppingDisplay />;
      case "delivery": return <DeliveryDisplay />;
      case "payment": return <PaymentDisplay />;
      case "review": return <ReviewDisplay />;
      case "confirm": return <ConfirmDisplay />;
      case "sendOrder": return <LoadingDisplay />;
      case "sendOrderFailure": return <LoadingDisplay />;
      default: return <ErrorDisplay />;
    }
  }

  return (
    <>{getCurrentDisplay()}</>
  );
}

function ShoppingDisplay() {
  const { send } = useContext(ShoppingMachineContext);

  function handleCheckout() {
    send({ type: "toDelivery" });
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
  const { send } = useContext(ShoppingMachineContext);
  const { loading, productList, toggleDisabled } = useContext(ProductListContext);

  const onAddToCart = (product: Product) => send({ type: "addToCart", product, toggleDisabled })

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
  const { send, state } = useContext(ShoppingMachineContext);
  const { toggleDisabled } = useContext(ProductListContext);

  const onIncrement = (id: number) => send({ type: "increment", id });
  const onDecrement = (id: number) => send({ type: "decrement", id, toggleDisabled });
  const onRemoveFromCart = (id: number) => send({ type: "removeFromCart", id, toggleDisabled });

  return <div>
    <h2>Cart</h2>
    <div>
      <p>Subtotal: ${state.context.cart.subTotal.toFixed(2)}</p>
    </div>
    <div>
      {state.context.cart.products.map((p) => (
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
  const { send } = useContext(ShoppingMachineContext);

  function handleNext() {
    send({ type: "toPayment" });
  }

  function handleToShopping() {
    send({ type: "toShopping" });
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
  const { send } = useContext(ShoppingMachineContext);

  function handleNext() {
    send({ type: "toReview" });
  }

  function handleToShopping() {
    send({ type: "toShopping" });
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
  const { state, send } = useContext(ShoppingMachineContext);

  function handleNext() {
    send({ type: "toConfirm" });
  }

  function handleToShopping() {
    send({ type: "toShopping" });
  }

  function handleError() {
    send({ type: "toError" });
  }

  return (
    <div>
      <h2>Review</h2>
      <h3>Cart</h3>
    <div>
      <p>Subtotal: ${state.context.cart.subTotal.toFixed(2)}</p>
    </div>
    <div>
      {state.context.cart.products.map((p) => (
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
  const { state, send } = useContext(ShoppingMachineContext);
  const { toggleDisabled } = useContext(ProductListContext);

  function handleNext() {
    send({ type: "toShopping", toggleDisabled });
  }

  return (
    <div>
      <h2>Order Confirmed</h2>
      <div>
        <p>Order ID: {state.context.orderId}</p>
      </div>
      <div>
        <p>Subtotal: ${state.context.cart.subTotal.toFixed(2)}</p>
      </div>
      <button onClick={handleNext} >Next</button>
    </div>
  );
}

function ErrorDisplay() {
  const { state, send } = useContext(ShoppingMachineContext);

  function handleContinue() {
    send({ type: "toShopping" });
  }

  return (
    <div>
      <h2>Something Unexpected Occurred</h2>
      {state.context.exception ? (<div>{state.context.exception}</div>) : (<></>)}
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