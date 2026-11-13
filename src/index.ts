import {getProducts} from "./api";

(() => {
  const productsListWrapper = document.getElementById("products-list") as HTMLElement | null
  const productItemTemplate = document.getElementById("product-tpl") as HTMLTemplateElement | null

  if (!productsListWrapper || !productItemTemplate) {
    throw new Error("Key elements are missing")
  }

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
    setText('[data-slot="price"]', String(product.price));
    setText('[data-slot="category"]', product.category);

    const image = card.querySelector('[data-slot="image"]');
    if (image instanceof HTMLImageElement && product.images[0]) {
      image.alt = product.title;
      image.src = product.images[0];
    }

    return card;
  };

  getProducts()
    .then(res => {
      const {products} = res;
      products.map(prod => {
        productsListWrapper.appendChild(createProductCard(prod))
      })
    })
    .catch(console.error)
})()