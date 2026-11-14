import {getProducts} from "./api";
import {State} from "./State";
import type {Product} from "./interfaces";
import {Cart} from "./Cart";

interface AppState {
  products: Product[];
}

(() => {
  const productsListWrapper = document.getElementById("products-list") as HTMLElement|null
  const productItemTemplate = document.getElementById("product-tpl") as HTMLTemplateElement|null
  const cartTemplate = document.getElementById("cart-tpl") as HTMLTemplateElement|null
  const header = document.querySelector("header") as HTMLElement|null

  if (!productsListWrapper || !productItemTemplate || !cartTemplate || !header) {
    throw new Error("Key elements are missing")
  }

  // Initialize global state
  let state = new State<AppState>()

  // Initialize cart
  let cart = new Cart()

  /**
   * Update cart
   */
  const updateCart = (): void => {
    header.innerHTML = ''
    const initialCartItems = cart.all()

    if (!initialCartItems.length) {
      return;
    }

    let cartTotalPrice = 0
    const tpl = cartTemplate.content.cloneNode(true) as DocumentFragment
    const cartEl = tpl.firstElementChild
    const cartItemsList = cartEl?.querySelector('[data-slot="items"]')
    const totalPriceSlot = cartEl?.querySelector('[data-slot="total"]')

    if (!(cartEl instanceof HTMLElement) || !cartItemsList || !totalPriceSlot) {
      throw new Error("Could not find core elements in cart template");
    }

    const fragment = document.createDocumentFragment()
    for (const cartItem of initialCartItems) {
      const {product: {id, title}, quantity, totalPrice} = cartItem
      const li = document.createElement("li")
      li.id = `cart-item-${id}`
      li.innerHTML = `
          <span>${title} (${quantity})</span> --- <strong>$${totalPrice.toFixed(2)}</strong>
        `
      fragment.appendChild(li)
      cartTotalPrice += totalPrice
    }

    totalPriceSlot.textContent = `$${cartTotalPrice.toFixed(2)}`
    cartItemsList.appendChild(fragment)
    header.appendChild(cartEl)
  }

  updateCart()

  /**
   * Create a single product item/card element
   * @param product
   */
  const createProductCard = (product: Readonly<Product>): HTMLElement => {
    const fragment = productItemTemplate.content.cloneNode(true) as DocumentFragment;
    const card = fragment.firstElementChild;

    if (!(card instanceof HTMLElement)) {
      throw new Error("Could not find root element in product template");
    }

    card.id = String(product.id);
    card.dataset.productId = String(product.id);

    const setText = (selector: string, text: string) => {
      const target = card.querySelector(selector);
      if (target instanceof HTMLElement) {
        target.textContent = text;
      }
    };

    setText('[data-slot="name"]', product.title);
    setText('[data-slot="desc"]', product.description);
    setText('[data-slot="price"]', `$${String(product.price)}`);
    setText('[data-slot="category"]', product.category);

    const image = card.querySelector('[data-slot="image"]');
    if (image instanceof HTMLImageElement && product.images[0]) {
      image.alt = product.title;
      image.src = product.images[0];
    }

    return card;
  };

  /**
   * Get products data and populate DOM
   */
  getProducts()
    .then(res => {
      const {products} = res;

      // Store data into global state
      state.set("products", products)

      // Populate DOM with products
      const fragment = document.createDocumentFragment()
      for (const prod of products) {
        fragment.appendChild(createProductCard(prod))
      }
      productsListWrapper.appendChild(fragment)

      // Add event listeners to "add to cart" buttons
      document.addEventListener("click", function (event) {
        const {target} = event
        const atcButton = target instanceof Element
          ? target.closest(".js-add-to-cart") as HTMLButtonElement
          : null
        if (atcButton) {
          const targetProduct = atcButton.closest(".product")

          if (!targetProduct || !(targetProduct instanceof HTMLElement)) {
            return
          }

          const productId = Number(targetProduct.dataset.productId);
          const products = state.get("products");
          const product = products?.find((p) => p.id === productId);

          if (product) {
            atcButton.textContent = "Added to cart"
            atcButton.disabled = true
            cart.add(product);
            updateCart();
            setTimeout(() => {
              atcButton.textContent = "Add to cart"
              atcButton.disabled = false
            }, 800);
          }
        }

        // Remove items
        const removeCartItemButton = target instanceof Element
          ? target.closest(".js-remove-items") as HTMLButtonElement
          : null
        if (removeCartItemButton) {
          cart.empty()
          updateCart()
        }
      })
    })
    .catch(console.error)
    .finally(() => {
      console.log({
        state: state.all()
      })
    })
})()