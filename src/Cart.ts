import type {CartItem, Product} from "./interfaces";

class Cart {
  #items: CartItem[] = []
  #storageKey: string = "ts_cart"

  add = (product: Product): void => {
    // @todo: save to localstorage
  }

  remove = (prodId: Product["id"]) => {
    // @todo: remove from localstorage
  }
}

export {Cart}