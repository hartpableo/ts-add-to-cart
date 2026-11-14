import type {ProductsCacheInterface, ProductsResponseInterface} from "./interfaces";

// Cache the products API response for specific duration so we don't flood the API server with requests
export class ProductsCache {
  #cacheKey: string = "ts_products_cache";
  #ttl: number = 86400; // 24 hours

  get(): ProductsCacheInterface | null {
    const lsItem = localStorage.getItem(this.#cacheKey);
    if (!lsItem) {
      return null;
    }

    try {
      return JSON.parse(lsItem) as ProductsCacheInterface;
    } catch {
      localStorage.removeItem(this.#cacheKey);
      return null;
    }
  }

  set(data: ProductsResponseInterface): void {
    try {
      localStorage.setItem(
        this.#cacheKey,
        JSON.stringify({
          data,
          time: Date.now(),
        })
      );
    } catch (e) {
      console.error("Failed to write to localStorage:", e);
    }
  }

  isValid(): boolean {
    const time = this.get()?.time;
    return Number.isFinite(time) && Date.now() - (time as number) <= this.#ttl * 1000;
  }
}
