export function sendOrderSuccess() {
  return new Promise((resolve) => {
    setTimeout(() => { resolve("abc123"); }, 1000);
  });
}

export function sendOrderFailure() {
  return new Promise((resolve) => {
    setTimeout(() => { resolve("abc123"); }, 1000);
  });
}
