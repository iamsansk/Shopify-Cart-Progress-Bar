document.addEventListener("DOMContentLoaded", function () {
  function formatCurrency(amount) {
    const code = window.tierBarSettings?.currencyCode || 'INR';
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function positionTierIcons(container) {
    const icons = container.querySelectorAll(".tier-icon");
    const thresholds = Array.from(icons).map((icon) => parseFloat(icon.dataset.threshold));
    const max = Math.max(...thresholds, 1);

    icons.forEach((icon) => {
      if (icon.dataset.positioned === "true") return;
      const threshold = parseFloat(icon.dataset.threshold);
      const pos = (threshold / max) * 100;
      icon.style.left = `${pos}%`;
      icon.dataset.positioned = "true";
    });
  }

  function calculateCartValue(cartData) {
    const basis = window.tierBarSettings?.basis || 'subtotal';
    let value = 0;
    if (basis === 'total') {
      value = cartData.total_price / 100;
    } else {
      cartData.items.forEach((item) => {
        if (item.price > 0) {
          value += (item.price * item.quantity) / 100;
        }
      });
    }
    return value;
  }

  function updateTierMessage(container, subtotal, thresholds) {
    const messageEl = container.querySelector(".tier-message");
    if (!messageEl) return;

    const sorted = thresholds.sort((a, b) => a - b);
    const next = sorted.find((t) => subtotal < t);
    if (next) {
      const remaining = Math.ceil(next - subtotal);
      messageEl.textContent = `Add ${formatCurrency(remaining)} more to unlock your next reward`;
    } else {
      messageEl.textContent = window.tierBarSettings?.successMessage;
    }
  }

  function updateProgressBar(container, cartData) {
    const fill = container.querySelector(".progress-fill");
    const icons = container.querySelectorAll(".tier-icon");

    const subtotal = calculateCartValue(cartData);
    const thresholds = Array.from(icons).map((i) => parseFloat(i.dataset.threshold));
    const max = Math.max(...thresholds, 1);
    const percent = Math.min((subtotal / max) * 100, 100);
    fill.style.width = `${percent}%`;

    positionTierIcons(container);

    icons.forEach((icon) => {
      const tier = parseFloat(icon.dataset.threshold);
      icon.style.borderColor = subtotal >= tier ? "#10b981" : "#ccc";
    });

    updateTierMessage(container, subtotal, thresholds);
  }

  function fetchAndUpdateBars() {
    fetch("/cart.js")
      .then((r) => r.json())
      .then((data) => {
        document.querySelectorAll(".cart-progress-container").forEach((container) => {
          updateProgressBar(container, data);
        });
      })
      .catch((e) => console.error("Cart fetch failed", e));
  }

  // Init
  document.querySelectorAll(".cart-progress-container").forEach((container) => {
    positionTierIcons(container);
  });

  fetchAndUpdateBars();

  window.addEventListener("cart:updated", (e) => {
    const cartData = e.detail?.cartData;
    if (cartData) {
      document.querySelectorAll(".cart-progress-container").forEach((container) => {
        updateProgressBar(container, cartData);
      });
    } else {
      fetchAndUpdateBars();
    }
  });

  const observer = new MutationObserver(() => {
    document.querySelectorAll(".cart-progress-container").forEach((container) => {
      positionTierIcons(container);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
