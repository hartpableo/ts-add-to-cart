// Cache the products API response for specific duration so we don't flood the API server with requests
class ProductsCache {
  #cacheKey: string = "ts_products_cache"
  #ttl: number = 86400 // 24 hours

  get = (): ProductsCacheInterface|null => {
    const lsItem = localStorage.getItem(this.#cacheKey)
    if (!lsItem) {
      return null
    }

    return JSON.parse(localStorage.getItem(this.#cacheKey) ?? "")
  }

  set = (data: ProductsResponseInterface): void => {
    localStorage.setItem(this.#cacheKey, JSON.stringify({
      data: data,
      time: Date.now()
    }))
  }

  isValid = (): boolean => {
    const time = this.get()?.time
    return Number.isFinite(time) && (Date.now() - (time as number)) <= (this.#ttl * 1000)
  }
}

export {ProductsCache}