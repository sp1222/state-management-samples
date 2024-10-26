"use client";
import { shoppingMachine } from "@/xstate/shopping-machine";
import { useMachine } from "@xstate/react";
import { createContext, useContext } from "react";
import { Actor } from "xstate";

interface ShoppingMachineContextType {
  state: ReturnType<Actor<typeof shoppingMachine>["getSnapshot"]>;
  send: Actor<typeof shoppingMachine>["send"];
}

export const ShoppingMachineContext = createContext<ShoppingMachineContextType>({
  state: (shoppingMachine as any).initialState,
  send: () => {},
});

export function ShoppingMachineContextProvider({children}: {children: React.ReactNode}) {
  const [state, send] = useMachine(shoppingMachine);
  const value = {
    state,
    send,
  }
  return (
    <ShoppingMachineContext.Provider value={value}>{children}</ShoppingMachineContext.Provider>
  );
}
