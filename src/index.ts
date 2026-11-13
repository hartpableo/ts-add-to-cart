import {getProducts} from "./api";
import {State} from "./State";

(() => {
  const productsListWrapper = document.getElementById("products-list") as HTMLElement | null
  const productItemTemplate = document.getElementById("product-tpl") as HTMLTemplateElement | null

  if (!productsListWrapper || !productItemTemplate) {
    throw new Error("Key elements are missing")
  }

  // Initialize global state
  let state = new State()

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
      products.map(prod => {
        productsListWrapper.appendChild(createProductCard(prod))
      })
    })
    .catch(console.error)
    .finally(() => {
      console.log({
        state: state.all()
      })
    })
})()