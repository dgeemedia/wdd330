import ExternalServices from './ExternalServices.mjs';
import { getLocalStorage, setLocalStorage, alertMessage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (!this.product) {
      console.error('Product not found for ID:', this.productId);
      alertMessage('Product not found. Please try again.', true);
      return;
    }
    this.renderProductDetails();
    document.getElementById('addToCart').addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    this.addProductToCart(this.product);
  }

  addProductToCart(product) {
    let cartItems = getLocalStorage('so-cart') || [];
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.id === product.Id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cartItems.push({
        id: product.Id,
        name: product.Name,
        price: product.FinalPrice,
        quantity: 1,
      });
    }

    setLocalStorage('so-cart', cartItems);
    alertMessage(`${product.Name} added to cart!`, false);
  }

  renderProductDetails() {
    const selectors = {
      brand: '.product-detail h3',
      name: '.divider h2',
      image: '.divider img',
      price: '.product-card__price',
      color: '.product__color',
      description: '.product__description',
      addToCart: '#addToCart',
    };

    try {
      document.querySelector(selectors.brand).textContent = this.product.Brand?.Name || 'Unknown Brand';
      document.querySelector(selectors.name).textContent = this.product.NameWithoutBrand || this.product.Name;
      const imageElement = document.querySelector(selectors.image);
      imageElement.src = this.product.Images?.PrimaryLarge || '';
      imageElement.alt = this.product.Name || 'Product Image';
      document.querySelector(selectors.price).textContent = `$${this.product.FinalPrice?.toFixed(2) || '0.00'}`;
      document.querySelector(selectors.color).textContent = this.product.Colors?.[0]?.ColorName || 'N/A';
      document.querySelector(selectors.description).innerHTML = this.product.DescriptionHtmlSimple || 'No description available';
      document.querySelector(selectors.addToCart).dataset.id = this.product.Id;
    } catch (error) {
      console.error('Error rendering product details:', error);
      alertMessage('Failed to display product details. Please try again.', true);
    }
  }
}