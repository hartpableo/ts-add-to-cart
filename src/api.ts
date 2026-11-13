import {API_BASE} from "./configs";

export const getProducts = async (): Promise<ProductsResponse> => {
  const url = new URL(`${API_BASE}`)
  url.searchParams.set("limit", "50")

  const response = await fetch(url.toString())
  return await response.json() as Promise<ProductsResponse>
}