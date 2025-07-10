// ProductDetails.mjs
import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Use the datasource to get the details for the current product
    this.product = await this.dataSource.findProductById(this.productId);
    
    // Check if product details were retrieved
    if (!this.product) {
      console.error("Product not found for ID:", this.productId);
      alert("Product not found. Please try again.");
      return;
    }

    // Render the product details to the HTML
    this.renderProductDetails();

    // Added a listener to the Add to Cart button
    // Using .bind(this) to ensure the correct context for 'this' in addToCart
    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    // Call addProductToCart with the stored product
    this.addProductToCart(this.product);
  }

  //Retained
  addProductToCart(product) {
    let cartItems = getLocalStorage("so-cart");

    if (!Array.isArray(cartItems)) {
      if (cartItems && typeof cartItems === 'object') {
        cartItems = [cartItems];
      } else {
        cartItems = [];
      }
    }

    cartItems.push(product);
    setLocalStorage("so-cart", cartItems);
    alert('Product added to cart!');
  }

  //Retained
  renderProductDetails() {
    document.querySelector(".product-detail h3").textContent = this.product.Brand.Name;
    document.querySelector(".divider h2").textContent = this.product.NameWithoutBrand;
    document.querySelector(".divider img").src = this.product.Image;
    document.querySelector(".divider img").alt = this.product.Name;
    document.querySelector(".product-card__price").textContent = `$${this.product.FinalPrice}`;
    document.querySelector(".product__color").textContent = this.product.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML = this.product.DescriptionHtmlSimple;
    document.querySelector("#addToCart").dataset.id = this.product.Id;
  }
}