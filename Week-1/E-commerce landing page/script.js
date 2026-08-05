/* ==========================================================
   BAZAARIO — script.js
   Beginner-friendly vanilla JS, split into small labelled
   sections. No frameworks, no build step — just DOM APIs.
   ========================================================== */

/* ---------- 1. PRODUCT DATA ----------
   In a real store this would come from a server/API.
   Here it's a plain array so the logic below is easy to follow. */
const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds", category: "electronics", price: 1799, rating: 4.3, reviews: 812, img: "earbuds" },
  { id: 2, name: "Smart Fitness Band", category: "electronics", price: 1299, rating: 4.1, reviews: 540, img: "fitband" },
  { id: 3, name: "Cotton Kurti", category: "fashion", price: 799, rating: 4.5, reviews: 233, img: "kurti" },
  { id: 4, name: "Denim Jacket", category: "fashion", price: 1899, rating: 4.4, reviews: 128, img: "jacket" },
  { id: 5, name: "Non-Stick Cookware Set", category: "home", price: 2199, rating: 4.6, reviews: 964, img: "cookware" },
  { id: 6, name: "Cotton Bedsheet Set", category: "home", price: 999, rating: 4.2, reviews: 341, img: "bedsheet" },
  { id: 7, name: "Herbal Face Wash", category: "beauty", price: 249, rating: 4.0, reviews: 601, img: "facewash" },
  { id: 8, name: "Matte Lipstick Combo", category: "beauty", price: 449, rating: 4.3, reviews: 289, img: "lipstick" },
  { id: 9, name: "Laptop Backpack", category: "electronics", price: 1349, rating: 4.5, reviews: 720, img: "backpack" },
  { id: 10, name: "Running Shoes", category: "fashion", price: 1999, rating: 4.4, reviews: 455, img: "shoes" },
  { id: 11, name: "Aroma Diffuser", category: "home", price: 899, rating: 4.1, reviews: 176, img: "diffuser" },
  { id: 12, name: "Sunscreen SPF 50", category: "beauty", price: 379, rating: 4.6, reviews: 512, img: "sunscreen" },
];

let currentFilter = "all";
let cartCount = 0;

/* ---------- 2. RENDER PRODUCT GRID ----------
   Turns the PRODUCTS array into HTML cards and drops them
   into #productGrid. Re-run whenever the filter changes. */
function renderProducts(filter = "all") {
  const grid = document.getElementById("productGrid");
  const list = filter === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === filter);

  grid.innerHTML = list.map((p) => `
    <article class="product-card" data-category="${p.category}">
      <img src="https://picsum.photos/seed/bazaario-${p.img}/240/240" alt="${p.name}" loading="lazy" />
      <h3>${p.name}</h3>
      <p class="rating">★ ${p.rating} <span>(${p.reviews})</span></p>
      <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
      <button class="add-to-cart" data-name="${p.name}" data-price="${p.price}">Add to Cart</button>
    </article>
  `).join("");
}
renderProducts();

/* ---------- 3. FILTER TABS ----------
   Clicking a tab updates the "active" style and re-renders
   the grid with only that category. */
const filterTabs = document.querySelectorAll(".filter-tab");
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentFilter = tab.dataset.filter;
    renderProducts(currentFilter);
  });
});

/* ---------- 4. ADD TO CART ----------
   Uses event delegation on the whole document because product
   cards are re-created every time the filter changes — a
   listener attached directly to a button would be lost on re-render. */
document.addEventListener("click", (e) => {
  const button = e.target.closest(".add-to-cart");
  if (!button) return;

  cartCount += 1;
  document.getElementById("cartBadge").textContent = cartCount;
  showToast(`${button.dataset.name} added to cart`);
});

/* ---------- 5. TOAST NOTIFICATION ----------
   Small popup that fades in, then fades out after a delay. */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- 6. FLASH-SALE COUNTDOWN ----------
   Counts down to a fixed end time. If the sale has already
   ended, it just resets to another 6 hours so the demo never
   shows a dead timer. */
function startCountdown() {
  let endTime = localStorage_safeGet();

  function tick() {
    const now = Date.now();
    let remaining = endTime - now;

    if (remaining <= 0) {
      endTime = Date.now() + 6 * 60 * 60 * 1000; // reset 6 hrs
      remaining = endTime - now;
    }

    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("cd-minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("cd-seconds").textContent = String(seconds).padStart(2, "0");
  }

  tick();
  setInterval(tick, 1000);
}

/* Keeps the same countdown target across a page refresh within
   the same session, using sessionStorage. Falls back gracefully
   if storage isn't available. */
function localStorage_safeGet() {
  try {
    const saved = sessionStorage.getItem("bazaario_deal_end");
    if (saved && Number(saved) > Date.now()) return Number(saved);
    const end = Date.now() + 6 * 60 * 60 * 1000; // 6 hours from now
    sessionStorage.setItem("bazaario_deal_end", String(end));
    return end;
  } catch (err) {
    return Date.now() + 6 * 60 * 60 * 1000;
  }
}
startCountdown();

/* ---------- 7. MOBILE NAV TOGGLE ---------- */
const navToggle = document.getElementById("navToggle");
const categoryNav = document.getElementById("categoryNav");
navToggle.addEventListener("click", () => {
  const isOpen = categoryNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

/* ---------- 8. NEWSLETTER FORM ----------
   Simple client-side validation + confirmation message.
   No real submission — this is a front-end demo. */
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailInput = document.getElementById("newsletterEmail");
  const message = document.getElementById("newsletterMessage");

  if (emailInput.checkValidity()) {
    message.textContent = `Thanks! Deals will land in ${emailInput.value}`;
    emailInput.value = "";
  } else {
    message.textContent = "Please enter a valid email address.";
  }
});

/* ---------- 9. SEARCH FORM (demo only) ---------- */
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = e.target.querySelector("input").value.trim();
  if (query) showToast(`Searching for "${query}"…`);
});

/* ---------- 10. BACK TO TOP BUTTON ---------- */
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 500);
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
