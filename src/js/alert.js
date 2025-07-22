// src/js/alert.js
export default class Alert {
  constructor(jsonPath = "/json/alerts.json") {
    this.path = jsonPath;
    this.dismissTime = 5000; // Auto-dismiss after 5s
  }

  async showAlerts() {
    try {
      const response = await fetch(this.path);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const alerts = await response.json();
      if (!alerts?.length) return;

      this.createAlertContainer();
      this.renderAlerts(alerts);
    } catch (err) {
      this.showErrorFallback();
    }
  }

  createAlertContainer() {
    if (document.querySelector(".alert-list")) return;
    
    const section = document.createElement("section");
    section.className = "alert-list";
    document.querySelector("main")?.prepend(section);
  }

  renderAlerts(alerts) {
    const container = document.querySelector(".alert-list");
    
    alerts.forEach(alert => {
      const alertEl = document.createElement("div");
      alertEl.className = "alert";
      alertEl.setAttribute("role", "alert");
      alertEl.style.setProperty("--bg-color", alert.background || "#f8d7da");
      alertEl.style.setProperty("--text-color", alert.color || "#721c24");
      
      alertEl.innerHTML = `
        <p>${alert.message}</p>
        <button class="alert-dismiss" aria-label="Dismiss alert">&times;</button>
      `;
      
      container.appendChild(alertEl);
      this.setupDismissal(alertEl);
    });
  }

  setupDismissal(alertEl) {
    const dismissBtn = alertEl.querySelector(".alert-dismiss");
    dismissBtn.addEventListener("click", () => alertEl.remove());
    
    setTimeout(() => {
      alertEl.classList.add("fade-out");
      setTimeout(() => alertEl.remove(), 300);
    }, this.dismissTime);
  }

  showErrorFallback() {
    const fallback = document.createElement("div");
    fallback.className = "alert alert-error";
    fallback.innerHTML = `
      <p>Service alerts currently unavailable</p>
    `;
    document.querySelector("main")?.prepend(fallback);
  }
}
