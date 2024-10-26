export enum State {
  SHOPPING = "none",
  DELIVERY = "delivery",
  PAYMENT = "payment",
  REVIEW = "review",
  CONFIRM = "confirm",
  SEND_ORDER = "sendOrder",
  SEND_ORDER_FAILURE = "sendOrderFailure",
  ERROR = "error",
}

const StateValues: { [key in State]: State } = {
  [State.SHOPPING]: State.SHOPPING,
  [State.DELIVERY]: State.DELIVERY,
  [State.PAYMENT]: State.PAYMENT,
  [State.REVIEW]: State.REVIEW,
  [State.CONFIRM]: State.CONFIRM,
  [State.SEND_ORDER]: State.SEND_ORDER,
  [State.SEND_ORDER_FAILURE]: State.SEND_ORDER_FAILURE,
  [State.ERROR]: State.ERROR,
};

export const getState = (error: string | unknown): State => {
  return StateValues[error as keyof typeof StateValues];
};
