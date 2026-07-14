const products = {
  mono: { name: "Aevum Mono", price: 8990 },
  noct: { name: "Aevum Noct", price: 8990 },
  sol: { name: "Aevum Sol", price: 8990 }
};

const shippingFee = 1390;
const studentDiscountRate = 0.1;

const formatPrice = (value) => `${value.toLocaleString("hu-HU")} Ft`;

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("aevumCart")) || {};
  } catch {
    return {};
  }
};

const saveCart = (cart) => {
  localStorage.setItem("aevumCart", JSON.stringify(cart));
};

const updateCartCount = () => {
  const count = Object.values(getCart()).reduce((sum, quantity) => sum + quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((item) => {
    item.textContent = count;
    item.hidden = count === 0;
  });
};

const updateProductControls = () => {
  const cart = getCart();
  document.querySelectorAll("[data-product-control]").forEach((control) => {
    const productId = control.dataset.productControl;
    const quantity = cart[productId] || 0;
    const label = control.querySelector(".add-label");
    const count = control.querySelector("[data-item-count]");

    control.classList.toggle("added", quantity > 0);
    if (label) label.textContent = quantity > 0 ? "Hozzáadva" : "Hozzáadás";
    if (count) count.textContent = quantity;
  });
};

const addToCart = (productId) => {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
  updateCartCount();
  updateProductControls();
};

const removeOneFromCart = (productId) => {
  const cart = getCart();
  if (!cart[productId]) return;

  cart[productId] -= 1;
  if (cart[productId] <= 0) {
    delete cart[productId];
  }

  saveCart(cart);
  updateCartCount();
  updateProductControls();
  renderCheckoutCart();
};

const removeProductFromCart = (productId) => {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  updateCartCount();
  updateProductControls();
  renderCheckoutCart();
};

const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  observer.observe(item);
});

document.querySelectorAll(".bubble-button").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    button.style.setProperty("--x", `${x}px`);
    button.style.setProperty("--y", `${y}px`);
  });

  button.addEventListener("click", () => {
    button.classList.remove("pop");
    void button.offsetWidth;
    button.classList.add("pop");
    window.setTimeout(() => {
      button.classList.remove("pop");
    }, 430);
  });
});

document.querySelectorAll(".cart-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    const href = link.getAttribute("href");
    if (!href) return;

    event.preventDefault();
    link.classList.remove("cart-ride");
    void link.offsetWidth;
    link.classList.add("cart-ride");

    window.setTimeout(() => {
      window.location.href = href;
    }, 520);
  });
});

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.product;
    const cart = getCart();
    if (!cart[productId]) {
      addToCart(productId);
    }
  });
});

document.querySelectorAll("[data-plus-product]").forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.plusProduct);
  });
});

document.querySelectorAll("[data-minus-product]").forEach((button) => {
  button.addEventListener("click", () => {
    removeOneFromCart(button.dataset.minusProduct);
  });
});

const scrollHour = document.querySelector("[data-scroll-hour]");
const scrollMinute = document.querySelector("[data-scroll-minute]");
const scrollWatch = document.querySelector("[data-scroll-watch]");

const moveWatchHands = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
  const progress = window.scrollY / maxScroll;

  if (scrollHour && scrollMinute) {
    const minuteRotation = 42 + progress * 720;
    const hourRotation = 315 + progress * 180;
    scrollMinute.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
    scrollHour.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
  }

  if (scrollWatch) {
    const watchY = Math.round(progress * -34);
    const watchRotate = (progress * 7 - 2).toFixed(2);
    const featureMinuteRotation = 42 + progress * 900;
    const featureHourRotation = 310 + progress * 240;
    scrollWatch.style.setProperty("--watch-scroll-y", `${watchY}px`);
    scrollWatch.style.setProperty("--watch-scroll-rotate", `${watchRotate}deg`);
    scrollWatch.style.setProperty("--feature-minute-rotation", `${featureMinuteRotation}deg`);
    scrollWatch.style.setProperty("--feature-hour-rotation", `${featureHourRotation}deg`);
  }
};

window.addEventListener("scroll", moveWatchHands, { passive: true });
moveWatchHands();

const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const discountPanel = document.querySelector("#discountPanel");
const discountChoices = document.querySelectorAll("[data-discount-type]");
const discountCode = document.querySelector("#discountCode");
const discountActivate = document.querySelector("#discountActivate");
const discountMessage = document.querySelector("#discountMessage");
let selectedDiscountType = "";
let discountApplied = false;

const hasStudentDiscount = () => discountApplied;

const setDiscountMessage = (message, type = "") => {
  if (!discountMessage) return;
  discountMessage.textContent = message;
  discountMessage.classList.toggle("error", type === "error");
  discountMessage.classList.toggle("success", type === "success");
};

const resetDiscountActivation = () => {
  discountApplied = false;
  if (discountPanel) discountPanel.classList.remove("applied");
  renderCheckoutCart();
};

const openDiscountMode = (type) => {
  selectedDiscountType = type;
  resetDiscountActivation();
  if (!discountPanel || !discountCode) return;

  discountPanel.classList.add("open");
  discountChoices.forEach((button) => {
    button.classList.toggle("active", button.dataset.discountType === type);
  });

  discountCode.value = "";
  discountCode.placeholder = type === "student" ? "Di\u00e1kigazolv\u00e1ny sz\u00e1m" : "Kuponk\u00f3d";
  setDiscountMessage("");
  discountCode.focus();
};

const activateDiscount = () => {
  if (!discountCode || !selectedDiscountType || !discountPanel) return;
  const value = discountCode.value.trim();
  const isValid = selectedDiscountType === "student" ? [10, 11].includes(value.length) : value === "KUPON10";

  if (!isValid) {
    discountApplied = false;
    discountPanel.classList.remove("applied");
    setDiscountMessage(selectedDiscountType === "student" ? "\u00c9rv\u00e9nytelen di\u00e1kigazolv\u00e1ny sz\u00e1m." : "\u00c9rv\u00e9nytelen kuponk\u00f3d.", "error");
    renderCheckoutCart();
    return;
  }

  discountApplied = true;
  discountPanel.classList.add("applied");
  setDiscountMessage("Kedvezm\u00e9ny aktiv\u00e1lva.", "success");
  renderCheckoutCart();
};

if (discountPanel && discountCode && discountActivate) {
  discountChoices.forEach((button) => {
    button.addEventListener("click", () => openDiscountMode(button.dataset.discountType));
  });

  discountCode.addEventListener("input", resetDiscountActivation);
  discountActivate.addEventListener("click", activateDiscount);
}

const addQueryProductToCart = () => {
  const params = new URLSearchParams(window.location.search);
  const watchName = params.get("ora");
  const productId = Object.keys(products).find((id) => products[id].name === watchName);
  if (productId) {
    const cart = getCart();
    if (!cart[productId]) {
      cart[productId] = 1;
      saveCart(cart);
    }
  }
};

const renderCheckoutCart = () => {
  if (!cartItems || !cartTotal) return;
  addQueryProductToCart();
  const cart = getCart();
  const entries = Object.entries(cart).filter(([id, quantity]) => products[id] && quantity > 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
  const discount = hasStudentDiscount() ? Math.round(subtotal * studentDiscountRate) : 0;
  const shipping = entries.length > 0 ? shippingFee : 0;
  const total = subtotal - discount + shipping;

  cartTotal.textContent = formatPrice(total);

  if (entries.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">A kosarad jelenleg üres.</p>`;
    return;
  }

  cartItems.innerHTML = entries
    .map(([id, quantity]) => {
      const product = products[id];
      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong>
            <span>${quantity} db x ${formatPrice(product.price)}</span>
          </div>
          <strong>${formatPrice(product.price * quantity)}</strong>
          <button class="bubble-button cart-remove" type="button" data-remove-product="${id}" aria-label="${product.name} törlése a kosárból">
            <span class="trash-icon" aria-hidden="true"></span>
          </button>
        </div>
      `;
    })
    .join("") + `
      <div class="cart-line">
        <span>Órák összesen</span>
        <strong>${formatPrice(subtotal)}</strong>
      </div>
      ${discount > 0 ? `
      <div class="cart-line discount-line">
        <span>${selectedDiscountType === "coupon" ? "Kupon" : "Diákkedvezmény"} <em>-10%</em></span>
        <strong>-${formatPrice(discount)}</strong>
      </div>
      ` : ""}
      <div class="cart-line">
        <span>Szállítási díj</span>
        <strong>${formatPrice(shipping)}</strong>
      </div>
      <div class="cart-line cart-total-line">
        <span>Összesen</span>
        <strong>${formatPrice(total)}</strong>
      </div>
    `;

  cartItems.querySelectorAll("[data-remove-product]").forEach((button) => {
    button.addEventListener("click", () => {
      removeProductFromCart(button.dataset.removeProduct);
    });
  });
};

renderCheckoutCart();
updateCartCount();
updateProductControls();

const checkoutForm = document.querySelector("#checkoutForm");
const formNote = document.querySelector("#formNote");

if (checkoutForm && formNote) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!checkoutForm.reportValidity()) {
      return;
    }

    const cartHasItems = Object.values(getCart()).some((quantity) => quantity > 0);
    if (!cartHasItems) {
      formNote.textContent = "A rendelés elküldéséhez először adj hozzá legalább egy órát a kosárhoz.";
      return;
    }

    const formData = new FormData(checkoutForm);
    const buyerName = String(formData.get("name") || "Vásárló").trim() || "Vásárló";
    sessionStorage.setItem("aevumBuyerName", buyerName);
    localStorage.removeItem("aevumCart");
    window.location.href = `thankyou.html?nev=${encodeURIComponent(buyerName)}`;
  });
}

const thanksMessage = document.querySelector("#thanksMessage");

if (thanksMessage) {
  const params = new URLSearchParams(window.location.search);
  const buyerName = params.get("nev") || sessionStorage.getItem("aevumBuyerName") || "";
  const greeting = buyerName ? `Köszönjük, ${buyerName}!` : "Köszönjük!";
  thanksMessage.textContent = `${greeting} A rendelési adatokat rögzítettük, az email címedre elküldtük a számlát.`;
  updateCartCount();
}
