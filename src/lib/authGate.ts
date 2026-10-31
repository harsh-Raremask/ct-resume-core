export type GateKey =
  | 'gatePurchase'
  | 'gateFreeClaim'
  | 'gateDownload'
  | 'gateRewards'
  | 'gateReviews'
  | 'gateWishlist'
  | 'gateOrderCenter';

type Handler = (key: GateKey, action: () => void) => void;

let handler: Handler | null = null;

export function registerGateHandler(fn: Handler | null) {
  handler = fn;
}

export function gate(key: GateKey, action: () => void) {
  if (handler) handler(key, action);
  else action();
}
