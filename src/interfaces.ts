interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  images: string[]
}

interface ProductsResponse {
  products: Product[]
  limit: number
}