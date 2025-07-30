import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam, setLocalStorage, alertMessage } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');
const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const myList = new ProductList(category, dataSource, listElement);
myList.init();

// Event listener for Add to Cart buttons
document.querySelectorAll('.product-card .add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const productId = button.dataset.id; // Use data-id from button
    addToCart(productId);
  });
});

function addToCart(productId) {
  // Fetch product details and add to cart
  dataSource.findProductById(productId).then(product => {
    let cart = getLocalStorage('so-cart') || [];
    cart.push(product);
    setLocalStorage('so-cart', cart);
    alertMessage(`Added ${product.NameWithoutBrand} to cart!`);
  }).catch(error => alertMessage(`Error adding to cart: ${error.message}`));
}