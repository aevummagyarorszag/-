const products = {
  aevum: { name: "Aevum - Piros", price: 9630, image: "assets/products/aevum-1.webp" },
  "opium-red": { name: "Opium - Piros", price: 8990, image: "assets/products/opium-red-1.jpg" },
  "opium-silver": { name: "Opium - Ezüst", price: 8990, image: "assets/products/opium-silver-1.jpg" },
  "opium-green": { name: "Opium - Zöld", price: 8990, image: "assets/products/opium-green-1.jpg" },
  "gothic-silver": { name: "Gothic - Ezüst", price: 8990, image: "assets/products/gothic-silver-1.jpg" },
  "gothic-blue": { name: "Gothic - Kék", price: 8990, image: "assets/products/gothic-blue-1.jpg" },
  "gothic-red": { name: "Gothic - Piros", price: 8990, image: "assets/products/gothic-red-1.jpg" },
  "strap-adjuster-gold": { name: "Óraszíj állító - Arany", price: 290, image: "assets/products/strap-adjuster-gold.jpg" },
  "strap-adjuster-red": { name: "Óraszíj állító - Piros", price: 290, image: "assets/products/strap-adjuster-red.jpg" },
  "premium-adjuster": { name: "Prémium óraszíj állító", price: 390, image: "assets/products/premium-adjuster.jpg" },
  "premium-box": { name: "Prémium doboz", price: 990, image: "assets/products/premium-box-1.jpg" }
};

const productGalleries = {
  aevum: ["assets/products/aevum-1.webp", "assets/products/aevum-2.webp", "assets/products/aevum-3.webp", "assets/products/aevum-4.jpg", "assets/products/aevum-extra-strap.jpg", "assets/products/shared-box.jpg", "assets/products/shared-adjuster.jpg"],
  "opium-red": ["assets/products/opium-red-1.jpg", "assets/products/opium-red-2.jpg", "assets/products/opium-red-3.jpg", "assets/products/opium-red-4.jpg", "assets/products/opium-extra-strap.jpg", "assets/products/shared-box.jpg", "assets/products/shared-adjuster.jpg"],
  "opium-silver": ["assets/products/opium-silver-1.jpg", "assets/products/opium-silver-2.jpg", "assets/products/opium-silver-3.jpg", "assets/products/opium-silver-4.jpg", "assets/products/opium-extra-strap.jpg", "assets/products/shared-box.jpg", "assets/products/shared-adjuster.jpg"],
  "opium-green": ["assets/products/opium-green-1.jpg", "assets/products/opium-green-2.jpg", "assets/products/opium-green-3.jpg", "assets/products/opium-green-4.jpg", "assets/products/opium-extra-strap.jpg", "assets/products/shared-box.jpg", "assets/products/shared-adjuster.jpg"],
  "gothic-silver": ["assets/products/gothic-silver-1.jpg", "assets/products/gothic-silver-2.jpg", "assets/products/gothic-silver-3.jpg", "assets/products/gothic-silver-4.jpg", "assets/products/gothic-extra-strap.jpg", "assets/products/shared-box.jpg", "assets/products/shared-adjuster.jpg"],
  "gothic-blue": ["assets/products/gothic-blue-1.jpg", "assets/products/gothic-blue-2.jpg", "assets/products/gothic-blue-3.jpg", "assets/products/gothic-blue-4.jpg", "assets/products/gothic-extra-strap.jpg", "assets/products/shared-box.jpg", "assets/products/shared-adjuster.jpg"],
  "gothic-red": ["assets/products/gothic-red-1.jpg", "assets/products/gothic-red-2.jpg", "assets/products/gothic-red-3.jpg", "assets/products/gothic-red-4.jpg", "assets/products/gothic-extra-strap.jpg", "assets/products/shared-box.jpg", "assets/products/shared-adjuster.jpg"],
  "strap-adjuster-gold": ["assets/products/strap-adjuster-gold.jpg"],
  "strap-adjuster-red": ["assets/products/strap-adjuster-red.jpg"],
  "premium-adjuster": ["assets/products/premium-adjuster.jpg"],
  "premium-box": ["assets/products/premium-box-1.jpg", "assets/products/premium-box-2.jpg", "assets/products/premium-box-3.jpg", "assets/products/premium-box-4.jpg", "assets/products/premium-box-5.jpg", "assets/products/premium-box-6.jpg"]
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

const initProductCards = () => {
  document.querySelectorAll("[data-product-card]").forEach((card) => {
    const image = card.querySelector("[data-gallery-image]");
    const dots = card.querySelector("[data-gallery-dots]");
    const previous = card.querySelector("[data-gallery-prev]");
    const next = card.querySelector("[data-gallery-next]");
    const swatches = card.querySelectorAll("[data-variant]");
    const control = card.querySelector("[data-product-control]");
    const addButton = card.querySelector("[data-product]");
    const plusButton = card.querySelector("[data-plus-product]");
    const minusButton = card.querySelector("[data-minus-product]");
    const checkoutLink = card.querySelector("[data-checkout-link]");
    const price = card.querySelector("[data-product-price]");
    let activeProduct = card.dataset.defaultProduct || swatches[0]?.dataset.variant;
    let activeImage = 0;

    const syncControls = () => {
      const product = products[activeProduct];
      if (!product) return;
      if (control) control.dataset.productControl = activeProduct;
      if (addButton) addButton.dataset.product = activeProduct;
      if (plusButton) {
        plusButton.dataset.plusProduct = activeProduct;
        plusButton.setAttribute("aria-label", `Még egy ${product.name} hozzáadása`);
      }
      if (minusButton) {
        minusButton.dataset.minusProduct = activeProduct;
        minusButton.setAttribute("aria-label", `Egy ${product.name} kivétele`);
      }
      if (price) price.textContent = formatPrice(product.price);
    };

    const renderGallery = () => {
      const gallery = productGalleries[activeProduct] || [];
      if (!gallery.length || !image) return;
      const hasMultipleImages = gallery.length > 1;
      activeImage = (activeImage + gallery.length) % gallery.length;
      image.src = gallery[activeImage];
      image.alt = `${products[activeProduct]?.name || "Aevum"} óra`;
      previous?.toggleAttribute("hidden", !hasMultipleImages);
      next?.toggleAttribute("hidden", !hasMultipleImages);
      if (dots) {
        dots.hidden = !hasMultipleImages;
        dots.innerHTML = hasMultipleImages ? gallery.map((_, index) => `
          <button class="gallery-dot${index === activeImage ? " active" : ""}" type="button" data-gallery-index="${index}" aria-label="${index + 1}. kép"></button>
        `).join("") : "";
        dots.querySelectorAll("[data-gallery-index]").forEach((dot) => {
          dot.addEventListener("click", () => {
            activeImage = Number(dot.dataset.galleryIndex);
            renderGallery();
          });
        });
      }
    };

    const selectVariant = (variant) => {
      if (!products[variant]) return;
      activeProduct = variant;
      activeImage = 0;
      swatches.forEach((swatch) => swatch.classList.toggle("active", swatch.dataset.variant === variant));
      syncControls();
      renderGallery();
      updateProductControls();
    };

    swatches.forEach((swatch) => {
      swatch.addEventListener("click", () => selectVariant(swatch.dataset.variant));
    });

    previous?.addEventListener("click", () => {
      activeImage -= 1;
      renderGallery();
    });

    next?.addEventListener("click", () => {
      activeImage += 1;
      renderGallery();
    });

    image?.addEventListener("click", () => {
      openImageZoom(image.dataset.zoomSrc || image.src, image.alt || "Aevum termékkép");
    });

    syncControls();
    renderGallery();
  });
};

initProductCards();

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

const privacyNoticeHtml = `
  <h3>Bevezetés</h3>
  <p>Jelen adatkezelési tájékoztató célja, hogy a weboldal látogatói és vásárlói átlátható, egyértelmű információt kapjanak arról, hogyan kezeljük személyes adataikat a GDPR (Általános Adatvédelmi Rendelet) és a hazai jogszabályok előírásainak megfelelően.</p>
  <h3>1. Kezelt adatok köre és az adatkezelés célja</h3>
  <p>Webáruházunkban történő vásárlás során az alábbi személyes adatokat kezeljük:</p>
  <p>Vásárlói adatok: Név, szállítási és számlázási cím (irányítószám, város, utca, házszám), e-mail cím, telefonszám.</p>
  <p>Rendelési adatok: A vásárolt termék megnevezése, a fizetett végösszeg, a rendelés időpontja.</p>
  <p>Az adatkezelés célja: A megrendelés teljesítése, a számla kiállítása, a csomag kézbesítése (futárszolgálat részére történő átadás), valamint a vásárló tájékoztatása a rendelés státuszáról.</p>
  <h3>2. Az adatkezelés jogalapja</h3>
  <p>Az adatkezelés jogalapja a vásárlóval kötött szerződés teljesítése (GDPR 6. cikk (1) bek. b) pont), valamint a hatályos számviteli jogszabályoknak való megfelelés (GDPR 6. cikk (1) bek. c) pont), amely a számla megőrzésére kötelez minket.</p>
  <h3>3. Adatfeldolgozók (Partnerek)</h3>
  <p>A megrendelések teljesítéséhez az alábbi külső szolgáltatók adatfeldolgozóként férhetnek hozzá az adatokhoz:</p>
  <p>GitHub Inc. (USA): A weboldal tárhelyszolgáltatója.</p>
  <p>Google LLC (USA): Az űrlapok feldolgozása és a rendelési adatok tárolása (Google Sheets).</p>
  <p>KBOSS.hu Kft. (Számlázz.hu): Számlázási adatok tárolása és számla kiállítása.</p>
  <p>GLS General Logistics Systems Hungary Kft.: A csomag kézbesítéséhez szükséges szállítási adatok (név, cím, e-mail cím, telefonszám) kezelése.</p>
  <h3>4. Adatok megőrzési ideje</h3>
  <p>A megrendeléshez kapcsolódó adatokat a szerződés teljesítésétől számított 5 évig őrizzük meg (polgári jogi elévülési idő).</p>
  <p>A kiállított számlákat a számviteli törvény előírása alapján 8 évig vagyunk kötelesek megőrizni.</p>
  <h3>5. Érintetti jogok</h3>
  <p>A vásárlót az adatkezeléssel kapcsolatban az alábbi jogok illetik meg:</p>
  <p>Hozzáféréshez való jog: Tájékoztatást kérhet a kezelt adatairól.</p>
  <p>Helyesbítés joga: Kérheti az adatok javítását, ha azok pontatlanok.</p>
  <p>Törlés joga: Kérheti az adatok törlését (kivéve, ha az adatkezelést jogszabály írja elő, pl. számlázás).</p>
  <p>Tiltakozás joga: Tiltakozhat az adatkezelés ellen.</p>
  <h3>6. Kapcsolattartás és az Adatkezelő adatai</h3>
  <p>Amennyiben adatvédelmi aggályod merül fel, vagy élni kívánsz a jogaiddal, kérjük, keresd meg adatkezelőnket az alábbi elérhetőségeken:</p>
  <p class="privacy-owner">Adatkezelő: Kubena Colton<br>Cím: 8000 Székesfehérvár, Donát utca 64.<br>E-mail: aevummagyarorszag@gmail.com</p>
  <h3>7. Jogorvoslat</h3>
  <p>Amennyiben a megkeresésedet nem sikerült orvosolni, panaszt nyújthatsz be a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH):</p>
  <p>Cím: 1055 Budapest, Falk Miksa utca 9-11.</p>
  <p>Weboldal: www.naih.hu</p>
`;

const privacyModal = document.querySelector("#privacyModal");
const cookieModal = document.querySelector("#cookieModal");
const privacyContent = document.querySelector("[data-privacy-content]");

if (privacyContent && !privacyContent.innerHTML.trim()) {
  privacyContent.innerHTML = privacyNoticeHtml;
}

const openModal = (modal) => {
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".privacy-close")?.focus();
};

const closeModal = (modal) => {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
};

document.querySelectorAll("[data-open-privacy]").forEach((button) => {
  button.addEventListener("click", () => openModal(privacyModal));
});

document.querySelectorAll("[data-open-cookie]").forEach((button) => {
  button.addEventListener("click", () => openModal(cookieModal));
});

document.querySelectorAll("[data-close-privacy], [data-privacy-close]").forEach((button) => {
  button.addEventListener("click", () => closeModal(privacyModal));
});

document.querySelectorAll("[data-close-cookie], [data-cookie-close]").forEach((button) => {
  button.addEventListener("click", () => closeModal(cookieModal));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal(privacyModal);
    closeModal(cookieModal);
    closeImageZoom();
  }
});

const imageZoomModal = document.querySelector("#imageZoomModal");
const imageZoomImage = document.querySelector("#imageZoomImage");
const imageZoomCloseButtons = document.querySelectorAll("[data-close-image-zoom], [data-image-zoom-close]");
const imageZoomIn = document.querySelector("[data-zoom-in]");
const imageZoomOut = document.querySelector("[data-zoom-out]");
let imageZoomScale = 1;

const setImageZoomScale = (scale) => {
  imageZoomScale = Math.min(Math.max(scale, 1), 2.8);
  if (imageZoomImage) {
    imageZoomImage.style.transform = `scale(${imageZoomScale})`;
  }
};

const openImageZoom = (src, alt) => {
  if (!imageZoomModal || !imageZoomImage || !src) return;
  imageZoomImage.src = src;
  imageZoomImage.alt = alt;
  setImageZoomScale(1);
  imageZoomModal.hidden = false;
  document.body.style.overflow = "hidden";
};

const closeImageZoom = () => {
  if (!imageZoomModal) return;
  imageZoomModal.hidden = true;
  setImageZoomScale(1);
  if (imageZoomImage) imageZoomImage.removeAttribute("src");
  document.body.style.overflow = "";
};

imageZoomCloseButtons.forEach((button) => {
  button.addEventListener("click", closeImageZoom);
});

imageZoomIn?.addEventListener("click", () => setImageZoomScale(imageZoomScale + 0.25));
imageZoomOut?.addEventListener("click", () => setImageZoomScale(imageZoomScale - 0.25));
imageZoomImage?.addEventListener("click", () => setImageZoomScale(imageZoomScale === 1 ? 1.8 : 1));
imageZoomModal?.addEventListener("wheel", (event) => {
  event.preventDefault();
  setImageZoomScale(imageZoomScale + (event.deltaY < 0 ? 0.18 : -0.18));
}, { passive: false });

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
  if (!cartItems) return;
  addQueryProductToCart();
  const cart = getCart();
  const entries = Object.entries(cart).filter(([id, quantity]) => products[id] && quantity > 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => sum + products[id].price * quantity, 0);
  const discount = hasStudentDiscount() ? Math.round(subtotal * studentDiscountRate) : 0;
  const shipping = entries.length > 0 ? shippingFee : 0;
  const total = subtotal - discount + shipping;

  if (cartTotal) {
    cartTotal.textContent = formatPrice(total);
  }

  if (entries.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">A kosarad jelenleg üres.</p>`;
    return;
  }

  cartItems.innerHTML = entries
    .map(([id, quantity]) => {
      const product = products[id];
      return `
        <div class="cart-item">
          <img class="cart-thumb" src="${product.image}" alt="${product.name}">
          <div class="cart-item-copy">
            <strong>${product.name}</strong>
            <span>${quantity} db x ${formatPrice(product.price)}</span>
          </div>
          <button class="bubble-button cart-remove" type="button" data-remove-product="${id}" aria-label="${product.name} törlése a kosárból">
            <span class="trash-icon" aria-hidden="true"></span>
          </button>
        </div>
      `;
    })
    .join("") + `
      <div class="cart-line">
        <span>Termékek összesen</span>
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
  checkoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!checkoutForm.reportValidity()) {
      return;
    }

    const cartHasItems = Object.values(getCart()).some((quantity) => quantity > 0);
    if (!cartHasItems) {
      formNote.textContent = "A rendelés elküldéséhez először adj hozzá legalább egy órát a kosárhoz.";
      return;
    }

    const cart = getCart();
    const cartDetails = Object.entries(cart)
      .map(([id, q]) => `${products[id].name} (${q} db)`)
      .join(", ");

    const subtotal = Object.entries(cart).reduce((sum, [id, q]) => sum + products[id].price * q, 0);
    const discount = hasStudentDiscount() ? Math.round(subtotal * studentDiscountRate) : 0;
    const total = subtotal - discount + shippingFee;

    const hiddenTermek = document.getElementById('hiddenTermek');
    const hiddenKedvezmenyes = document.getElementById('hiddenKedvezmenyes');
    const hiddenOsszeg = document.getElementById('hiddenOsszeg');

    if (hiddenTermek) hiddenTermek.value = cartDetails;
    if (hiddenKedvezmenyes) hiddenKedvezmenyes.value = hasStudentDiscount() ? "Igen" : "Nem";
    if (hiddenOsszeg) hiddenOsszeg.value = `${total} Ft`;

    formNote.textContent = "Rendelés küldése folyamatban...";

    try {
      const formData = new FormData(checkoutForm);
      const response = await fetch(checkoutForm.action, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const buyerName = String(formData.get("nev") || "Vásárló").trim() || "Vásárló";
        sessionStorage.setItem("aevumBuyerName", buyerName);
        localStorage.removeItem("aevumCart");
        window.location.href = `thankyou.html?nev=${encodeURIComponent(buyerName)}`;
      } else {
        throw new Error("Hiba a szerveroldali küldésben");
      }
    } catch (error) {
      console.error(error);
      formNote.textContent = "Hiba történt a rendelés elküldése során. Kérlek próbáld újra!";
    }
  });
}

const subscribeForm = document.querySelector("#subscribeForm");
const subscribeMessage = document.querySelector("#subscribeMessage");

if (subscribeForm && subscribeMessage) {
  subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!subscribeForm.reportValidity()) {
      return;
    }

    const formData = new FormData(subscribeForm);
    const email = String(formData.get("subscribeEmail") || "").trim();
    subscribeMessage.textContent = `Köszönjük! A kupon hamarosan megérkezik erre az e-mail címre: ${email}`;
    subscribeMessage.classList.add("success");
    subscribeForm.reset();
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
