import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
 
const dataSource = new ProductData("tents");
 
function addProductToCart(product) {
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
 
async function addToCartHandler(e) {
  try {
    const product = await dataSource.findProductById(e.target.dataset.id);
    if (!product) {
      alert('Product not found. Please try again.');
      return;
    }
    addProductToCart(product);
  } catch (error) {
    alert('An error occurred while adding to cart. Please try again.');
  }
}
 
const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) {
  addToCartButton.addEventListener("click", addToCartHandler);
}