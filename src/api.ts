import {API_BASE} from "./configs";
import {ProductsCache} from "./ProductsCache";

export const getProducts = async (): Promise<ProductsResponseInterface> => {
  const cache = new ProductsCache()

  if (!cache.isValid()) {
    const url = new URL(`${API_BASE}`)
    url.searchParams.set("limit", "50")

    const response = await fetch(url.toString())
    const json = await response.json()
    cache.set(json)
    return json as ProductsResponseInterface
  }

  const cacheData = cache.get()

  if (!cacheData) {
    throw new Error("Error fetching cached data")
  }

  console.log({cacheData})

  return cacheData.data as ProductsResponseInterface
}