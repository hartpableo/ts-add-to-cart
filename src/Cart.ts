import type {CartItem, Product} from "./interfaces";

export class Cart {
  #storageKey: string = "ts_cart";
  #items: CartItem[];

  constructor() {
    this.#items = this.#load();
  }

  #load(): CartItem[] {
    const raw = localStorage.getItem(this.#storageKey);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem(this.#storageKey);
      return [];
    }
  }

  all(): CartItem[] {
    return this.#items;
  }

  add(product: Product): void {
    const existing = this.#items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
      existing.totalPrice = existing.quantity * existing.product.price;
    } else {
      this.#items.push({
        product,
        quantity: 1,
        totalPrice: product.price,
      });
    }

    this.#save();
  }

  remove(prodId: Product["id"]): CartItem[] {
    this.#items = this.#items.filter((item) => item.product.id !== prodId);
    this.#save();
    return this.#items;
  }

  empty(): void {
    this.#items = [];
    localStorage.removeItem(this.#storageKey);
  }

  #save(): void {
    try {
      localStorage.setItem(this.#storageKey, JSON.stringify(this.#items));
    } catch (e) {
      console.error("Failed to write to localStorage:", e);
    }
  }
}