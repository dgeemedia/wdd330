import ProductList from './ProductList.mjs';
import ProductData from './ProductData.mjs';

// Wait for DOM to be fully loaded before running
window.addEventListener('DOMContentLoaded', async () => {
  // Select the container where product cards will be rendered
  const listElement = document.querySelector('#product-list');

  if (!listElement) {
    console.error('No element found with id "product-list"');
    return;
  }

  // Create a data source for the category "tents"
  const dataSource = new ProductData('tents');

  // Create the product list instance
  const productList = new ProductList('tents', dataSource, listElement);

  // Initialize and render the product list
  try {
    await productList.init();
  } catch (error) {
    console.error('Error loading product list:', error);
  }
});
