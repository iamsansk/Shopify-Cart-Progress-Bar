document.addEventListener("DOMContentLoaded", function () {
    // Format currency Function
  function formatCurrency(amount) {
    const code = window.tierBarSettings?.currencyCode || 'INR';
  
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Set icon position only if it hasn't been set before
  function positionTierIcons() {
    const icons = document.querySelectorAll(".tier-icon");
    const thresholds = Array.from(icons).map((icon) => parseFloat(icon.dataset.threshold));
    const max = Math.max(...thresholds, 1);
  
    icons.forEach((icon) => {
      if (icon.dataset.positioned === "true") return;
  
      const threshold = parseFloat(icon.dataset.threshold);
      const pos = (threshold / max) * 100;
  
      icon.style.left = `${pos}%`;
      icon.dataset.positioned = "true"; // mark as positioned
    });
  }

  // Calculate subtotal excluding freebies
  function calculateCartValue(cartData) {
    const basis = window.tierBarSettings?.basis || 'subtotal';
    let value = 0;
  
    if (basis === 'total') {
      // Total after discounts (discounted total_price from cart)
      value = cartData.total_price / 100;
    } else {
      // Subtotal based on items excluding freebies
      cartData.items.forEach((item) => {
        if (item.price > 0) {
          value += (item.price * item.quantity) / 100;
        }
      });
    }
  
    return value;
  }

  // Show "₹xxx to next tier" message
  function updateTierMessage(subtotal, thresholds) {
    const messageEl = document.getElementById("tier-message");
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


  // Update bar UI
  function updateProgressBar(cartData) {
    const container = document.getElementById("cart-progress-bar");
    if (!container || !cartData) return;

    const fill = container.querySelector(".progress-fill");
    const icons = container.querySelectorAll(".tier-icon");

    const subtotal = calculateCartValue(cartData);
    const thresholds = Array.from(icons).map((i) =>
      parseFloat(i.dataset.threshold)
    );
    const max = Math.max(...thresholds, 1);
    const percent = Math.min((subtotal / max) * 100, 100);
    fill.style.width = `${percent}%`;

    // Position icons only if not already positioned
    positionTierIcons();

    // Update border color (don't reposition)
    icons.forEach((icon) => {
      const tier = parseFloat(icon.dataset.threshold);
      icon.style.borderColor = subtotal >= tier ? "#10b981" : "#ccc";
    });

    updateTierMessage(subtotal, thresholds);
  }

  // Fetch cart if not passed
  function fetchAndUpdateBar() {
    fetch("/cart.js")
      .then((r) => r.json())
      .then((data) => updateProgressBar(data))
      .catch((e) => console.error("Cart fetch failed", e));
  }

  // Init
  positionTierIcons();
  fetchAndUpdateBar();
  // Handle cart updates
  window.addEventListener("cart:updated", (e) => {
    const cartData = e.detail?.cartData;
    if (cartData) {
      updateProgressBar(cartData);
    } else {
      fetchAndUpdateBar();
    }
  });

  // Re-position icons after cart-drawer re-renders (edge case)
  const observer = new MutationObserver(() => positionTierIcons());
  observer.observe(document.body, { childList: true, subtree: true });
});
