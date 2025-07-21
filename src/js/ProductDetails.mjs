import { getLocalStorage, setLocalStorage } from './utils.mjs';

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
      alert('Product not found. Please try again.');
      return;
    }
    this.renderProductDetails();
    document.getElementById('addToCart').addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    this.addProductToCart(this.product);
  }

  addProductToCart(product) {
    let cartItems = getLocalStorage('so-cart');
    if (!Array.isArray(cartItems)) {
      cartItems = cartItems && typeof cartItems === 'object' ? [cartItems] : [];
    }
    cartItems.push(product);
    setLocalStorage('so-cart', cartItems);
    alert('Product added to cart!');
  }

  renderProductDetails() {
    document.querySelector('.product-detail h3').textContent = this.product.Brand.Name;
    document.querySelector('.divider h2').textContent = this.product.NameWithoutBrand;
    document.querySelector('.divider img').src = this.product.Images.PrimaryLarge;
    document.querySelector('.divider img').alt = this.product.Name;
    document.querySelector('.product-card__price').textContent = `$${this.product.FinalPrice}`;
    document.querySelector('.product__color').textContent = this.product.Colors[0].ColorName;
    document.querySelector('.product__description').innerHTML = this.product.DescriptionHtmlSimple;
    document.querySelector('#addToCart').dataset.id = this.product.Id;
  }
}