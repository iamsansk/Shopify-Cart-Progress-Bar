# 🛒 Shopify Cart Progress Bar

> 🎨 **IMPORTANT**: This cart progress bar is built and tested using the **Dawn theme**. The code is tailored to my requirements — **feel free to extend or customize** based on your own requirements.

---

## ✅ Setup Instructions

Follow the steps below to enable and configure the tiered progress bar on both your **cart drawer** and **cart page**.

---

### 📝 Note on File Naming

> **Note**: When you create a snippet or asset file, Shopify automatically appends the appropriate extension (like `.liquid` or `.js`).  
> Make sure your file name is exactly the same with extension included:
>
> - Snippet: `cart-progress-bar.liquid`  
> - JS Asset: `cart-progress-bar.js`

---

### 1️⃣ Create `cart-progress-bar.liquid` Snippet

- Go to **Online Store → Edit Code**.
- Under the **Snippets** folder, click **Add a new snippet** and name it:  
  `cart-progress-bar.liquid`
- Paste the complete Liquid + CSS structure here (shared in your working implementation).

---

### 2️⃣ Create `cart-progress-bar.js` asset

- In **Assets**, create new asset called:  
  `cart-progress-bar.js`
- Paste the full JavaScript code that:
  - Calculates subtotal or total
  - Updates the progress bar
  - Handles multi-currency
  - Works on both cart drawer and cart page

---

### 3️⃣ Update `settings_schema.json`

- Open `config/settings_schema.json`
- Add the following block under any section:

```json
{
    "name": "Cart Progress Bar",
    "settings": [
      {
        "type": "checkbox",
        "id": "enable_cart_progress",
        "label": "Enable Cart Progress Bar",
        "default": true
      },
      {
        "type": "select",
        "id": "progress_basis",
        "label": "Progress Basis",
        "default": "total",
        "options": [
          {
            "value": "subtotal",
            "label": "Subtotal (before discounts, excludes freebies)"
          },
          {
            "value": "total",
            "label": "Total (after discounts, includes discounts & shipping)"
          }
        ]
      },
      {
        "type": "number",
        "id": "tier_1_amount",
        "label": "Tier 1 Amount",
        "default": 0
      },
      {
        "type": "image_picker",
        "id": "tier_1_image",
        "label": "Tier 1 Image"
      },
      {
        "type": "number",
        "id": "tier_2_amount",
        "label": "Tier 2 Amount",
        "default": 0
      },
      {
        "type": "image_picker",
        "id": "tier_2_image",
        "label": "Tier 2 Image"
      },
      {
        "type": "number",
        "id": "tier_3_amount",
        "label": "Tier 3 Amount",
        "default": 0
      },
      {
        "type": "image_picker",
        "id": "tier_3_image",
        "label": "Tier 3 Image"
      },
      {
        "type": "color",
        "id": "progressbar_color",
        "label": "Progress Bar Fill Color",
        "default": "#10b981"
      },
      {
        "type": "text",
        "id": "success_message",
        "label": "Final Tier Unlocked Message",
        "default": "🎉 You've unlocked all rewards!"
      }
    ]
  }
```

---

### 4️⃣ Update cart-drawer.liquid

- Inside cart-drawer.liquid, render the progress bar snippet just above the `<cart-drawer-items` tag.
```liquid
{% if settings.enable_cart_progress %}
  {% unless cart == empty %}
    {% render 'cart-progress-bar' %}
  {% endunless %}
{% endif %}
```

---

### 5️⃣ Update main-cart-items.liquid for Cart Page

- In main-cart-items.liquid, place the snippet wherever you'd like the bar to appear(prefer to update above to the `<form` tag)
```liquid
{% if settings.enable_cart_progress %}
  {% unless cart == empty %}
    {% render 'cart-progress-bar' %}
  {% endunless %}
{% endif %}
```

---

### 6️⃣ 💡 Best Way to Use

- If you don't want to show a tier, leave its amount as 0 in the Theme Settings panel.
- The logic automatically hides any tier with a value of 0.

---

## 🐛 Found a Bug?

If you found any bugs in the code, feel free to:

- 📬 Reach out via email: [santhoshkumarb1309@gmail.com](mailto:santhoshkumarb1309@gmail.com)
- 🐙 Open an issue on GitHub: [GitHub Issues](https://github.com/iamsansk/Shopify-Custom-Freebie/issues)

Your feedback is always appreciated!

---

