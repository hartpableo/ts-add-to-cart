export interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  images: string[]
}

export interface ProductsResponseInterface {
  products: Product[]
  limit: number
}

export interface ProductsCacheInterface {
  time: number
  data: ProductsResponseInterface
}

export interface CartItem {
  product: Product
  quantity: number
  totalPrice: number
}