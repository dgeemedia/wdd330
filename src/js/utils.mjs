// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
  // Alternatively, use concise arrow function:
  // export const qs = (selector, parent = document) => parent.querySelector(selector);
}

// retrieve data from localStorage safely
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

// save data to localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click events on a selector
export function setClick(selector, callback) {
  const el = qs(selector);
  if (!el) return; // If element not found, do nothing

  el.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(event);
  });

  el.addEventListener("click", callback);
}
