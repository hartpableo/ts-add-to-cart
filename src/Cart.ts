import type {CartItem, Product} from "./interfaces";

export class Cart {
  #storageKey: string = "ts_cart";

  all(): CartItem[] {
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

  add(product: Product): void {
    const items = this.all();
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
      existing.totalPrice = existing.quantity * existing.product.price;
    } else {
      items.push({
        product,
        quantity: 1,
        totalPrice: product.price,
      });
    }

    this.#save(items);
  }

  remove(prodId: Product["id"]): CartItem[] {
    const filtered = this.all().filter((item) => item.product.id !== prodId);
    this.#save(filtered);
    return filtered;
  }

  #save(items: CartItem[]): void {
    try {
      localStorage.setItem(this.#storageKey, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to write to localStorage:", e);
    }
  }
}