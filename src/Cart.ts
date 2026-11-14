import type {CartItem, Product} from "./interfaces";

export class Cart {
  #items: CartItem[] = [];
  #storageKey: string = "ts_cart";

  add(product: Product): void {
    // @todo: save to localstorage
  }

  remove(prodId: Product["id"]): void {
    // @todo: remove from localstorage
  }
}
