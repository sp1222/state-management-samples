import { assign, createMachine, fromPromise } from "xstate";
import { Cart, ProductInCart } from "@/types/cart-and-products";
import { addProductToCart, decrementProductFromCart, incrementProductInCart, removeProductFromCart } from "@/utils/cart-actions";
import { sendOrderFailure, sendOrderSuccess } from "@/utils/machine-actions";

export const shoppingMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwBYHsAOGCWA7KAtALYCGAxinmAHSqY74DEJEEAKmgMIkBOALgG0ADAF1EoDGljY+2NLnEgAHogAsANgCM1dUPUAOAOz6AzACYD+gJxmANCACea-aurnVJgKxXNW9Yc9PAF8g+zosPEJSCipadAimHjAiNAA3MAAxHjQibn5hMSQQSWlZeUUVBFVDK2pPIVVfQ1VqzzM2+ycEEyFPaitVerNfC391M1UQsPiGKPJKXBpw2cY8MiSiMFxBUUUSmTkFIsqTUzrNIS99M3MTE0MAzsQtIX6bwwab-W8vKZBlyLEeaxAFMCBgdbJLY7QoSKQHcrHRAmKyvdqeVQudQ9FqafRPBCaQzaKyefz6fRCInqbHYv6guYxRZxeiRRh8NAAETAABtsOkeA4Cnt4WUjqBKr5qBdVEIzKZjOpMVYTKoCdd+rLqqd1FZdZpNPSZoDogsaOC+QKHOy0AAFEgOTbbYVFfZiiqIAjtbQGCaaTwfGmo8YEnVuLyqMwDDzmYlG1n4IFM828-lgQU2gDKxvwLrhpUOHoQBCa-T0Xis108+n9mjsjmRp3DGKjLTuZjjoX+OcZZuoGAdTr4NoASmBUtgwAB3PPFUWFpHFiZo7GaSPE1UBtUNqomdTS6o2CyGMxCBrBLsMpN9geO6FZnuzt0LiWIC59GmaExfvWBAJ10NXAGBpDB1PUfBleMEl7WIkgnacbU4eQADNsB4Ign3nRFXyXTwfWuRoAz0XU9HrLp1ECahBiEIx2ypOszCg2Zr1g8dJynB8EygTCC2w5RPVLa5rnMF460DAko1eO4W2jdtO2mLiWOZOD2JtABRHhsh4HiEXFfji0E+UbgsC4xL0CTI2bSNZNjQ1Lx7JSli2CAAHkeHBHhGAgeQaDwVI0AAayc3BXPc9MdPdRcSzJKioxqUD2hrPCyMQGpXmxAMyQ7PdTn0JiTWBZlYGctyPMYdMtP7HkSD4ZC0HQ2gSrC7TdldLC9MqaL92s+LzGrWsUoQaw+jPS5N1PD4fHyxNTRBJqPIyEhsB5ABXJIvJ86g-MC4LQo8iKX30ktLIeIRSTub9-EGAlzuoSkhlPCazrshToMcxqQtK9NFuWtawHKzT6qqmq6oa4rPuag6+M6tczGoU7zruJprp3d99GlXVdDlfwHlJaaYOZMgULQohOOgqGOueOoNFAvFAi8bLBoovpqNo8x6LMRj7MU2bmQq+qydmCmi33DF-G-b5PAZhKCQ+PoLDuGkMSMax1BCLtcDQcF4CKK9ebAEVeMp4sNHRmxNErTFEtrAkCDaNwCNVVVZT1Os1e5t79ZZaDDd0otOdeGxsX-f1elDGxqCEYxBhqTnT30d3XuYr2LTTQVfcinCCHuM3hktqsks0AkDVcC2yQT-0bnLF7ux5wqaFvIcM8OmGLn6Gl5UMCiaix7cuhROGo5cGt2hqUwuaTgrk2oFTp2b6HPT3dGKSjU8DSpDsi53FpXAMIlaYT-qO3x97wb29N5+NghI0DvPh+tvD1QmA8tGaYY8WJCfa89+uPvPngfqrSSJfIs19TxvAtvffqj9UZnhZoMCiNEIx6EmB7ZOv8ia4FQuhEBUULi1AogaGscpZTmC3uRSiWhjIPFVDYeS390HT35jwXBWcNQDAxIEGOxlGiy3lC-IkkYiGf3VkEIAA */
  id: "shopping-machine",
  initial: "shopping",
  context: {
    cart: {
      products: [] as ProductInCart[],
      subTotal: 0.00,
    },
    orderId: "",
    exception: "",
  },
  types: {} as {
    context: {
      cart: Cart,
      orderId: string,
      exception: string,
    },
  },
  states: {
    shopping: {
      on: {
        addToCart: {
          actions: assign({
            cart: ({ context, event }) => {
              const updatedCart = addProductToCart(context.cart, event.product);
              event.toggleDisabled(event.product.id, true);
              return updatedCart;
            },
          }),
        },
        removeFromCart: {
          actions: assign({
            cart: ({ context, event }) => {
              const updatedCart = removeProductFromCart(context.cart, event.id);
              event.toggleDisabled(event.id, false);
              return updatedCart;
            },
          }),
        },
        increment: {
          actions: assign({
            cart: ({ context, event }) => {
              const updatedCart = incrementProductInCart(context.cart, event.id);
              return updatedCart;
            },
          }),
        },
        decrement: {
          actions: assign({
            cart: ({ context, event }) => {
              const updatedCart = decrementProductFromCart(context.cart, event.id);
              if (!updatedCart.products.map(p => p.id).includes(event.id)) event.toggleDisabled(event.id, false);
              return updatedCart;
            },
          }),
        },
        toDelivery: {
          guard: ({ context }) => context.cart.products.length > 0,
          target: "delivery",
        },
      },
    },
    delivery: {
      on: {
        toPayment: {
          target: "payment",
        },
        toShopping: {
          target: "shopping",
          reenter: true
        },
      },
    },
    payment: {
      on: {
        toReview: {
          target: "review",
        },
        toShopping: {
          target: "shopping",
        },
      },
    },
    review: {
      on: {
        toConfirm: {
          target: "sendOrder",
        },
        toShopping: {
          target: "shopping",
        },
        toError: {
          target: "sendOrderFailure",
        },
      },
    },
    sendOrder: {
      invoke: {
        id: "sendOrder",
        src: fromPromise(({ input }) => {
          // invoke asynchronous action to submit the cart for the order.
          return sendOrderSuccess();
        }),
        input: ({ context: { cart } }) => ({ cart }),
        onDone: {
          actions: [
            assign({
              orderId: ({ event }) => event.output,
            }),
          ],
          target: "confirm",
        },
        onError: {
          actions: [
            assign({
              exception: ({ event }) => event.error as string,
            }),
          ],
          target: "error",
        }
      },
    },
    sendOrderFailure: {
      invoke: {
        id: "sendOrder",
        src: fromPromise(({ input }) => {
          // invoke asynchronous action to submit the cart for the order.
          return sendOrderFailure();
        }),
        input: ({ context: { cart } }) => ({ cart }),
        onDone: {
          actions: [
            assign({
              orderId: ({ event }) => event.output,
            }),
          ],
          target: "confirm",
        },
        onError: {
          actions: [
            assign({
              exception: ({ event }) => event.error as string,
            }),
          ],
          target: "error",
        }
      },
    },
    confirm: {
      on: {
        toShopping: {
          actions: [
            ({ context, event }) => context.cart.products.forEach(p => event.toggleDisabled(p.id, false)),
            assign({ cart: { products: [] as ProductInCart[], subTotal: 0.00 } as Cart }),
            assign({ orderId: "" }),
          ],
          target: "shopping",
        },
      },
    },
    error: {
      on: {
        toShopping: {
          actions: assign({ exception: "" }),
          target: "shopping",
        }
      }
    }
  },
});
