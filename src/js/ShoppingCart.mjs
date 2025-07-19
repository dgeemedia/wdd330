import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  init() {
    const cartItems = getLocalStorage(this.key) || [];
    this.renderCart(cartItems);
  }

  template(item) {
    // Count occurrences of item.Id in cartItems to determine quantity
    const cartItems = getLocalStorage(this.key) || [];
    const quantity = cartItems.filter(i => i.Id === item.Id).length;
    return `
      <li class="cart-card divider">
        <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
          <img src="${item.Image}" alt="${item.Name}" />
        </a>
        <div class="cart-card__details">
          <h2 class="card__name">${item.Name}</h2>
          <p class="cart-card__color">${item.Colors[0].ColorName}</p>
          <p class="cart-card__quantity">Qty: ${quantity}</p>
          <p class="cart-card__price">$${item.FinalPrice}</p>
        </div>
      </li>
    `;
  }

  renderCart(cartItems) {
    const parentElement = document.querySelector(this.parentSelector);
    if (parentElement) {
      renderListWithTemplate(this.template.bind(this), parentElement, cartItems, "afterbegin", true);
    }
  }
}