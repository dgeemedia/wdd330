import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  const cartFooter = document.querySelector(".cart-footer");

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");

    const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
    document.querySelector(".cart-total").textContent = `Total: $${total.toFixed(2)}`;

    // Enable checkout link
    document.querySelector(".checkout-button").classList.remove("disabled");
  } else {
    cartFooter.classList.add("hide");

    // Optionally disable checkout link
    const checkoutLink = document.querySelector(".checkout-button");
    if (checkoutLink) {
      checkoutLink.classList.add("disabled");
    }
  }

  // Clear cart functionality
  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("so-cart");
      renderCartContents(); // re-render to clear UI
    });
  }
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0]?.ColorName || "Default"}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

renderCartContents();
