import ExternalServices from './ExternalServices.mjs';

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = JSON.parse(localStorage.getItem(this.key)) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const subtotalElement = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalElement) {
      subtotalElement.innerText = this.itemTotal.toFixed(2);
    }
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06; // 6% sales tax
    const itemCount = this.list.reduce((total, item) => total + (item.quantity || 1), 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0; // $10 for first item, $2 per additional
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotalElement = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (taxElement) taxElement.innerText = this.tax.toFixed(2);
    if (shippingElement) shippingElement.innerText = this.shipping.toFixed(2);
    if (orderTotalElement) orderTotalElement.innerText = this.orderTotal.toFixed(2);
  }

  packageItems(items) {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));
  }

  async checkout(form) {
    const formData = formDataToJSON(form);
    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    try {
      const response = await this.services.checkout(order);
      alert('Order submitted successfully!');
      console.log(response); // For debugging; handle success response in next activity
    } catch (error) {
      alert('Order submission failed. Please try again.');
      console.error(error);
    }
  }   
}

// Initialize CheckoutProcess on page load
document.addEventListener('DOMContentLoaded', () => {
  const checkout = new CheckoutProcess('cart', '#orderSummary');
  checkout.init();

  // Trigger order total calculation when zip code is filled
  const zipCodeInput = document.querySelector('#zipCode');
  zipCodeInput.addEventListener('input', () => {
    if (zipCodeInput.value.trim()) {
      checkout.calculateOrderTotal();
    }
  });

  // Form validation
  const checkoutForm = document.querySelector('#checkoutForm');
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = checkoutForm.querySelectorAll('input[required]');
    let allFilled = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        allFilled = false;
        input.classList.add('border-red-500');
      } else {
        input.classList.remove('border-red-500');
      }
    });
    if (allFilled) {
      alert('Checkout submitted successfully!');
      // Add server-side submission logic here
    } else {
      alert('Please fill out all required fields.');
    }
  });
});