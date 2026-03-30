// ===================================
// MONEETIZE MARKETPLACE — INTERACTIVITY
// ===================================

// ---- State ----
let cart = [];
let currentCurrency = 'usd';
let currentTestimonial = 0;
let testimonialAutoplay;

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSearch();
  initCart();
  initTestimonials();
  initCountdown();
  initScrollAnimations();
});

// ===== HEADER =====
function initHeader() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  // Scroll-based header style
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  mobileClose.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== SEARCH =====
function initSearch() {
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 300);
  });

  searchClose.addEventListener('click', closeSearch);

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeMobileMenu();
      closeCart();
    }
  });

  // Live search filtering
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const products = document.querySelectorAll('.product-card');
    products.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('.product-desc').textContent.toLowerCase();
      const match = !query || name.includes(query) || desc.includes(query);
      card.style.display = match ? '' : 'none';
    });
  });
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== CATEGORY FILTER =====
function filterCategory(category) {
  // Update active category card
  document.querySelectorAll('.category-card').forEach(card => {
    card.classList.toggle('active', card.dataset.category === category);
  });

  // Filter product cards
  const products = document.querySelectorAll('.product-card');
  products.forEach(card => {
    if (category === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.category === category ? '' : 'none';
    }
  });
}

// ===== PRODUCT TAG FILTER =====
function filterProducts(tag) {
  // Update active filter tab
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.filter === tag);
  });

  const products = document.querySelectorAll('.product-card');
  products.forEach(card => {
    if (tag === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.tag === tag ? '' : 'none';
    }
  });
}

// ===== CURRENCY TOGGLE =====
function switchCurrency(currency) {
  currentCurrency = currency;

  // Update active button
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.currency === currency);
  });

  // Update all prices
  document.querySelectorAll('.price').forEach(priceEl => {
    const usd = priceEl.dataset.usd;
    const tripto = priceEl.dataset.tripto;
    const usdt = priceEl.dataset.usdt;

    switch (currency) {
      case 'usd':
        priceEl.textContent = `$${usd}`;
        break;
      case 'tripto':
        priceEl.textContent = `${tripto} TT`;
        break;
      case 'usdt':
        priceEl.textContent = `${usdt} USDT`;
        break;
    }
  });

  // Update alt prices
  document.querySelectorAll('.price-alt').forEach((alt, i) => {
    const priceEl = document.querySelectorAll('.price')[i];
    const tripto = priceEl.dataset.tripto;
    const usd = priceEl.dataset.usd;

    switch (currency) {
      case 'usd':
        alt.textContent = `≈ ${tripto} Tripto Tokens`;
        break;
      case 'tripto':
        alt.textContent = `≈ $${usd} USD`;
        break;
      case 'usdt':
        alt.textContent = `≈ ${tripto} Tripto Tokens`;
        break;
    }
  });

  updateCartTotal();
}

// ===== CART =====
function initCart() {
  const cartToggle = document.getElementById('cartToggle');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');

  cartToggle.addEventListener('click', openCart);
  cartOverlay.addEventListener('click', closeCart);
  cartClose.addEventListener('click', closeCart);
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function addToCart(name, price, image) {
  // Check if already in cart
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }

  updateCartUI();
  showToast(`${name} added to cart! 🛒`);

  // Animate the add button
  event.target.classList.add('added');
  event.target.textContent = '✓ Added';
  setTimeout(() => {
    event.target.classList.remove('added');
    event.target.textContent = '+ Add';
  }, 1500);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const cartItems = document.getElementById('cartItems');
  const cartBadge = document.getElementById('cartBadge');
  const cartCount = document.getElementById('cartCount');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalItems;
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}${item.qty > 1 ? ` ×${item.qty}` : ''}</h4>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
      </div>
    `).join('');
  }

  updateCartTotal();
}

function updateCartTotal() {
  const totalUSD = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartTotal = document.getElementById('cartTotal');

  switch (currentCurrency) {
    case 'usd':
      cartTotal.textContent = `$${totalUSD.toFixed(2)}`;
      break;
    case 'tripto':
      cartTotal.textContent = `${Math.round(totalUSD * 5)} TT`;
      break;
    case 'usdt':
      cartTotal.textContent = `${totalUSD.toFixed(2)} USDT`;
      break;
  }
}

function selectPayment(method) {
  document.querySelectorAll('.cart-pay-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.pay === method);
  });
  currentCurrency = method;
  updateCartTotal();
}

// ===== TESTIMONIALS =====
function initTestimonials() {
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prev = document.getElementById('prevTestimonial');
  const next = document.getElementById('nextTestimonial');
  const totalSlides = document.querySelectorAll('.testimonial-card').length;

  function goToSlide(index) {
    currentTestimonial = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentTestimonial));
  }

  prev.addEventListener('click', () => goToSlide(currentTestimonial - 1));
  next.addEventListener('click', () => goToSlide(currentTestimonial + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  // Autoplay
  testimonialAutoplay = setInterval(() => goToSlide(currentTestimonial + 1), 5000);

  // Pause on interaction
  [prev, next, ...dots].forEach(el => {
    el.addEventListener('click', () => {
      clearInterval(testimonialAutoplay);
      testimonialAutoplay = setInterval(() => goToSlide(currentTestimonial + 1), 5000);
    });
  });
}

// ===== COUNTDOWN =====
function initCountdown() {
  // Countdown target: 3 days from page load
  const target = new Date();
  target.setDate(target.getDate() + 3);

  function updateCountdown() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(mins).padStart(2, '0');
    document.getElementById('seconds').textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
