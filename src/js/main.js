import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// get the list container
const productListElement = document.querySelector(".product-list");

// Create instances
const dataSource = new ProductData("tents");
const tentList = new ProductList("tents", dataSource, productListElement);

// Load the list
tentList.init();
