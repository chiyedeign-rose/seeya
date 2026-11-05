(() => {
  const cartKey = 'karseell-bag-v3';
  const historyKey = 'karseell-search-history-v1';
  const discountKey = 'karseell-discount-v1';
  const giftThreshold = 75;
  const products = [
    { name: 'Karseell Collagen Hair Mask', image: 'assets/editor-1.jpg', price: 15.99, oldPrice: 24.99, rating: 4.9, reviews: 1063, keywords: 'mask collagen repair damaged dry hair' },
    { name: 'Karseell Maca Essence Oil', image: 'assets/editor-2.jpg', price: 38.99, rating: 4.8, reviews: 479, keywords: 'oil shine frizz argan maca' },
    { name: 'Karseell Deep Cleansing Shampoo', image: 'assets/editor-3.jpg', price: 88, rating: 4.8, reviews: 393, keywords: 'shampoo cleanse scalp oily' },
    { name: 'Karseell Repair Conditioner', image: 'assets/essential-4.jpg', price: 88, rating: 4.9, reviews: 326, keywords: 'conditioner repair moisture damaged hair' }
  ];
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const money = value => `$${Number(value).toFixed(2)}`;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const ratingMarkup = product => `<span class="dynamic-rating" aria-label="${product.rating} out of 5 stars"><span class="rating-stars" style="--rating:${product.rating / 5 * 100}%" aria-hidden="true"></span><span>${product.rating.toFixed(1)} (${product.reviews.toLocaleString()})</span></span>`;

  const feedback = message => {
    const node = document.getElementById('cartFeedback');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(feedback.timer);
    feedback.timer = setTimeout(() => node.classList.remove('is-visible'), 2400);
  };

  const siteHeader = document.querySelector('.site-nav');
  if (siteHeader && !document.querySelector('.site-header-stack')) {
    document.querySelector('.mobile-category-chips')?.remove();
    const stack = document.createElement('div');
    stack.className = 'site-header-stack';
    siteHeader.before(stack);
    stack.append(siteHeader);
    stack.insertAdjacentHTML('beforeend', `<nav class="commerce-category-nav" aria-label="Shop categories"><button class="category-arrow category-arrow--prev" type="button" aria-label="Previous categories">‹</button><div class="category-track"><a href="product.html">Hair Mask</a><a href="sets.html?filter=moisture">Shampoos</a><a href="sets.html">Set</a><a href="sets.html?filter=bestsellers">Best sellers</a><a href="sets.html?filter=color">Color Depositing</a><a href="quiz.html">Hair Quiz</a></div><button class="category-arrow category-arrow--next" type="button" aria-label="Next categories">›</button></nav>`);
    const track = stack.querySelector('.category-track');
    stack.querySelector('.category-arrow--prev').addEventListener('click', () => track.scrollBy({ left: -260, behavior: 'smooth' }));
    stack.querySelector('.category-arrow--next').addEventListener('click', () => track.scrollBy({ left: 260, behavior: 'smooth' }));
    const current = location.pathname.split('/').pop() || 'index.html';
    stack.querySelectorAll('.category-track a').forEach(link => {
      const target = link.getAttribute('href').split(/[?#]/)[0];
      link.classList.toggle('is-active', target === current || (current === 'quiz.html' && target === 'quiz.html'));
    });
    const updatePanelTop = () => document.documentElement.style.setProperty('--panel-top', `${stack.getBoundingClientRect().bottom}px`);
    let lastY = scrollY, downDistance = 0, upDistance = 0, ticking = false;
    const updateSmartHeader = () => {
      ticking = false;
      if (!matchMedia('(max-width:1024px)').matches) { document.body.classList.remove('mobile-nav-condensed'); updatePanelTop(); return; }
      const y = scrollY;
      const delta = y - lastY;
      if (y < 24) { document.body.classList.remove('mobile-nav-condensed'); downDistance = 0; upDistance = 0; }
      else if (delta > 1) { downDistance += delta; upDistance = 0; if (downDistance > 30) document.body.classList.add('mobile-nav-condensed'); }
      else if (delta < -1) { upDistance -= delta; downDistance = 0; if (upDistance > 46) document.body.classList.remove('mobile-nav-condensed'); }
      lastY = y;
      updatePanelTop();
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateSmartHeader); } }, { passive: true });
    addEventListener('resize', updateSmartHeader);
    stack.addEventListener('focusin', () => document.body.classList.remove('mobile-nav-condensed'));
    updateSmartHeader();
  }

  const bagPanel = document.getElementById('bagPanel');
  const bagItems = document.getElementById('bagItems');
  if (bagPanel && bagItems) {
    const heading = bagPanel.querySelector('.utility-heading');
    heading.insertAdjacentHTML('afterend', `<div class="cart-reward" aria-live="polite"><div class="cart-progress" aria-hidden="true"><span id="cartProgressFill"></span></div><p id="cartRewardMessage"></p><small>Use code: <strong>MINIGIFT</strong></small></div>`);
    bagPanel.insertAdjacentHTML('beforeend', `<div class="cart-checkout-shell">
      <form class="discount-form" id="discountForm"><input id="discountCode" type="text" placeholder="Enter your discount code" aria-label="Discount code"><button type="submit">Apply</button></form>
      <p class="discount-status" id="discountStatus" aria-live="polite"></p>
      <button class="cart-checkout" id="cartCheckout" type="button">CHECKOUT <span>•</span> <strong id="checkoutTotal">$0.00</strong></button>
      <div class="payment-options" aria-label="Express payment options"><button type="button" data-payment="PayPal">PayPal</button><button type="button" data-payment="Shop Pay">shop<span>Pay</span></button><button type="button" data-payment="Google Pay"><i>G</i> Pay</button></div>
      <p class="installment-note"><b>Klarna.</b> Or 4 interest-free payments of <span id="installmentAmount">$0.00</span></p>
    </div>`);
    const savedDiscount = read(discountKey, {}) || {};
    const trashIcon = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 10v7m4-7v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const updateCartShell = () => {
      const bag = read(cartKey, []).filter(item => item && Number(item.quantity) > 0);
      const subtotal = bag.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
      const discount = savedDiscount?.percent ? subtotal * savedDiscount.percent / 100 : 0;
      const total = Math.max(0, subtotal - discount);
      const remaining = Math.max(0, giftThreshold - subtotal);
      const progress = Math.min(100, subtotal / giftThreshold * 100);
      document.getElementById('cartProgressFill').style.width = `${progress}%`;
      document.getElementById('cartRewardMessage').textContent = remaining > 0 ? `You are ${money(remaining)} away from a free Gift.` : `Congrats! You've unlocked a free Gift!`;
      document.getElementById('checkoutTotal').textContent = money(total);
      document.getElementById('installmentAmount').textContent = money(total / 4);
      const status = document.getElementById('discountStatus');
      if (savedDiscount?.percent) status.textContent = `${savedDiscount.code} applied · ${savedDiscount.percent}% off`;
      bagItems.querySelectorAll('.cart-remove').forEach(button => {
        // Avoid rewriting the icon on every MutationObserver callback. Replacing
        // innerHTML creates another child-list mutation and previously caused an
        // endless update loop whenever the saved cart contained an item.
        if (button.dataset.cartIcon !== 'trash') {
          button.innerHTML = trashIcon;
          button.dataset.cartIcon = 'trash';
        }
        button.setAttribute('aria-label', `Remove ${button.closest('.cart-item')?.querySelector('h3')?.textContent || 'item'}`);
        button.title = 'Remove item';
      });
      const recommendation = bagPanel.querySelector('.cart-recommendations');
      if (recommendation) recommendation.hidden = false;
    };
    const observer = new MutationObserver(updateCartShell);
    observer.observe(bagItems, { childList: true, subtree: true });
    bagItems.addEventListener('click', event => { if (event.target.closest('[data-cart-action]')) { event.stopPropagation(); setTimeout(updateCartShell); } });
    document.addEventListener('click', event => { if (event.target.closest('[data-add-cart]')) setTimeout(updateCartShell); });
    document.getElementById('discountForm').addEventListener('submit', event => {
      event.preventDefault();
      const code = document.getElementById('discountCode').value.trim().toUpperCase();
      const offers = { KARSEELL10: 10, WELCOME15: 15 };
      const status = document.getElementById('discountStatus');
      if (!offers[code]) { status.textContent = 'This code is not valid for the current cart.'; return; }
      savedDiscount.code = code;
      savedDiscount.percent = offers[code];
      save(discountKey, savedDiscount);
      updateCartShell();
    });
    document.getElementById('cartCheckout').addEventListener('click', () => feedback('Checkout will connect to Shopify in the production store.'));
    bagPanel.querySelectorAll('[data-payment]').forEach(button => button.addEventListener('click', () => feedback(`${button.dataset.payment} will be available through Shopify checkout.`)));
    bagPanel.querySelector('.cart-continue')?.remove();
    updateCartShell();
  }

  const searchPanel = document.getElementById('searchPanel');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  if (searchPanel && searchForm && searchInput) {
    const searchContent = searchPanel.querySelector('.search-content');
    searchContent.innerHTML = `<div class="search-catalog">
      <section class="search-products" aria-labelledby="searchProductsTitle"><h3 id="searchProductsTitle">POPULAR PRODUCTS</h3><div class="search-product-grid" id="searchProductGrid"></div></section>
      <aside class="featured-search-content"><h3>FEATURED CONTENT</h3><a href="product.html"><img src="assets/beauty-science.png" alt="Karseell professional hair treatment" loading="lazy" decoding="async"><span><strong>How to choose a professional repair treatment</strong><small>Discover the right routine for dry, damaged and color-treated hair.</small></span></a><a href="product.html"><img src="assets/salon-1.jpg" alt="Karseell salon care" loading="lazy" decoding="async"><span><strong>Salon care versus everyday maintenance</strong><small>Learn when hair needs an intensive mask, oil or conditioner.</small></span></a></aside>
      <section class="search-discovery"><div><div class="search-label-row"><h3>RECENT SEARCHES</h3><button id="clearSearchHistory" type="button">Clear</button></div><div class="search-history" id="searchHistory"></div></div><div><h3>POPULAR SEARCHES</h3><div class="search-chips"><button type="button" data-search-term="Hair Mask">HAIR MASK</button><button type="button" data-search-term="Shampoo">SHAMPOO</button><button type="button" data-search-term="Hair Oil">HAIR OIL</button><button type="button" data-search-term="Conditioner">CONDITIONER</button></div></div></section>
    </div><div class="search-results" id="searchResults" aria-live="polite"></div>`;
    let history = read(historyKey, []);
    if (!Array.isArray(history)) history = [];
    const cardMarkup = product => `<article class="search-product-card"><a href="product.html"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async"><h4>${escapeHtml(product.name)}</h4></a>${ratingMarkup(product)}<div class="search-product-price"><span>${money(product.price)}${product.oldPrice ? ` <s>${money(product.oldPrice)}</s>` : ''}</span><button type="button" data-add-cart data-product="${escapeHtml(product.name)}" data-price="${product.price}">ADD</button></div></article>`;
    const renderHistory = () => {
      const node = document.getElementById('searchHistory');
      node.innerHTML = history.length ? history.map(term => `<span><button type="button" data-search-term="${escapeHtml(term)}">${escapeHtml(term)}</button><button type="button" data-remove-history="${escapeHtml(term)}" aria-label="Remove ${escapeHtml(term)}">×</button></span>`).join('') : '<small>No recent searches yet.</small>';
    };
    const renderProducts = query => {
      const normalized = query.trim().toLowerCase();
      const matches = normalized ? products.filter(product => `${product.name} ${product.keywords}`.toLowerCase().includes(normalized)) : products;
      document.getElementById('searchProductsTitle').textContent = normalized ? `SEARCH RESULTS FOR “${query.trim()}”` : 'POPULAR PRODUCTS';
      document.getElementById('searchProductGrid').innerHTML = matches.length ? matches.map(cardMarkup).join('') : '<p class="search-no-results">No matching products. Try Hair Mask, Shampoo, Hair Oil or Conditioner.</p>';
      document.getElementById('searchResults').innerHTML = '';
    };
    const runSearch = (term, remember = true) => {
      const query = term.trim();
      searchInput.value = query;
      if (remember && query) {
        history = [query, ...history.filter(item => item.toLowerCase() !== query.toLowerCase())].slice(0, 6);
        save(historyKey, history);
        renderHistory();
      }
      renderProducts(query);
    };
    searchForm.addEventListener('submit', event => { event.preventDefault(); runSearch(searchInput.value); });
    searchContent.addEventListener('click', event => {
      const searchButton = event.target.closest('[data-search-term]');
      if (searchButton) { runSearch(searchButton.dataset.searchTerm); searchInput.focus(); return; }
      const removeButton = event.target.closest('[data-remove-history]');
      if (removeButton) { history = history.filter(item => item !== removeButton.dataset.removeHistory); save(historyKey, history); renderHistory(); }
    });
    document.getElementById('clearSearchHistory').addEventListener('click', () => { history = []; save(historyKey, history); renderHistory(); });
    document.querySelectorAll('.mobile-search input').forEach(input => input.addEventListener('focus', () => {
      if (!searchPanel.classList.contains('is-open')) document.getElementById('searchToggle')?.click();
    }));
    renderHistory();
    renderProducts(searchInput.value);
  }

  const editorProducts = [
    { rating: 4.9, reviews: 1063, price: 15.99 },
    { rating: 4.8, reviews: 479, price: 38.99 },
    { rating: 4.8, reviews: 393, price: 88 }
  ];
  document.querySelectorAll('.editor-card').forEach((card, index) => {
    const product = editorProducts[index];
    if (!product || card.querySelector('.editor-rating-row')) return;
    const button = card.querySelector('[data-add-cart]');
    button.textContent = 'ADD';
    button.dataset.price = String(product.price);
    button.classList.add('editor-add');
    button.insertAdjacentHTML('beforebegin', `<div class="editor-rating-row">${ratingMarkup(product)}<strong>${money(product.price)}</strong></div>`);
  });
})();
