"use client";

import { getState, State } from "@/types/machine";
import { createContext, useContext, useEffect, useState } from "react";
import { CartContext } from "./cart-context";
import { sendOrderSuccess } from "@/utils/machine-actions";

interface MachineContextType {
  state: State,
  updateState: (newState: State|string) => void,
};

export const MachineContext = createContext<MachineContextType>({
  state: State.SHOPPING,
  updateState: () => { },
});

export function MachineContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(State.SHOPPING);
  const [orderId, setOrderId] = useState("");
  const {} = useContext(CartContext);

  useEffect(() => {
    switch(state) {
      case State.SEND_ORDER: {
        sendOrderSuccess();
        break;
      }
      case State.SEND_ORDER_FAILURE: {
        break;
      }
    }
  }, [state]);

  function updateState(newState: State|string) {
    if (typeof(newState) === "string") {
      setState(getState(newState));
    } else {
      setState(newState);
    }
  }

  const value = {
    state,
    updateState,
  };

  return (
    <MachineContext.Provider value={value} >{children}</MachineContext.Provider>
  );
}
