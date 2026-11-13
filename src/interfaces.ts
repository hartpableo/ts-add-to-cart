interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  images: string[]
}

interface ProductsResponseInterface {
  products: Product[]
  limit: number
}

interface ProductsCacheInterface {
  time: number
  data: ProductsResponseInterface
}

interface CartItem {
  product: Product
  quantity: number
  totalPrice: number
}