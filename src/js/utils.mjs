// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// Retrieve data from localStorage with error handling
export function getLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) {
      return null; // Return null instead of [] to allow caller to decide fallback
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return null; // Return null on parse error
  }
}

// Save data to localStorage
export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

// Set a listener for both touchend and click
export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element) {
    console.error(`Element not found for selector: ${selector}`);
    return;
  }
  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  element.addEventListener("click", callback);
}

// Get a query parameter from the URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = list.map(templateFn).join("");
  parentElement.insertAdjacentHTML(position, htmlString);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to fetch template from ${path}: ${res.statusText}`);
  }
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `
    <span>${message}</span>
    <span class="close-alert">X</span>
  `;
  alert.addEventListener('click', function (e) {
    if (e.target.classList.contains('close-alert')) {
      this.remove();
    }
  });
  const main = document.querySelector('main');
  main.prepend(alert);
  if (scroll) {
    window.scrollTo(0, 0);
  }
}