(() => {
  const mobile = matchMedia('(max-width:1024px)');
  const announcement = document.querySelector('.announcement');
  const desktopAnnouncement = document.createElement('span');
  desktopAnnouncement.className = 'plan-desktop';
  desktopAnnouncement.innerHTML = announcement.innerHTML;
  announcement.replaceChildren(desktopAnnouncement);
  announcement.insertAdjacentHTML('beforeend', '<div class="plan-announcement plan-mobile"><span>Mother\'s Day Special Offers &gt;</span><span aria-hidden="true">Mother\'s Day Special Offers &gt;</span></div>');

  document.querySelectorAll('.collection-card').forEach(card => {
    card.insertAdjacentHTML('beforeend', '<div class="plan-product-copy plan-mobile"><h3>TOTAL HAIR REPAIR SET</h3><div class="plan-rating"><span aria-label="4.8 out of 5 stars">★★★★<span class="plan-half-star">★</span></span><small>4.8 (393)</small></div><div class="plan-product-purchase"><span>$15.99 <s>$24.99</s></span><button type="button" data-add-cart data-price="15.99">ADD</button></div></div>');
    card.querySelector('.plan-product-copy button').dataset.product = card.querySelector('[data-product]').dataset.product;
    card.querySelector('.collection-image').insertAdjacentHTML('beforeend', '<span class="plan-saving plan-mobile">↓ 32% Savings</span>');
  });
  const collectionHeading = document.querySelector('.mobile-collection-copy');
  collectionHeading.classList.add('plan-collection-heading');
  collectionHeading.querySelector('h2').innerHTML = 'COLLAGEN REPAIR LINE';
  collectionHeading.querySelector('p').hidden = true;
  collectionHeading.parentElement.insertBefore(collectionHeading, collectionHeading.parentElement.firstChild);

  document.querySelector('.quality-score').insertAdjacentHTML('beforeend', '<span class="plan-quality-score plan-mobile"><strong>4.7</strong><span><span class="plan-quality-stars">★★★★★</span><b>BASED ON 32,856 REVIEWS</b></span></span>');
  document.querySelector('.quality-review').insertAdjacentHTML('beforeend', '<div class="plan-review plan-mobile"><span class="plan-quote" aria-hidden="true">“</span><div class="plan-review-rating"><span>★★★★★</span><small>2 days ago</small></div><p>I bought this Karseell hair treatment with collagen and argan oil with high expectations, and the truth is that it exceeded them! From the first use I noticed my hair was much softer, hydrated and with incredible shine.</p><p class="plan-review-product">About Karseell Argan Oil Hair Oil</p></div>');
  const satisfaction = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="5" width="26" height="30" rx="5" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="m20 10 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="currentColor"/></svg>';
  document.querySelector('.quality-points').insertAdjacentHTML('beforeend', '<div class="plan-service-grid plan-mobile"><div><img src="assets/service-quality.png" alt=""><p>GREAT PRICES<br>&amp; QUALITY</p></div><div>'+satisfaction+'<p>SATISFACTION<br>GUARANTEED</p></div><div><img src="assets/service-payment.png" alt=""><p>PAYMENT<br>SECURITY</p></div><div><img src="assets/service-support.png" alt=""><p>AFTER-SALES<br>SUPPORT</p></div></div>');
  const footerText = document.querySelector('.footer-grid>div:last-child>p');
  footerText.insertAdjacentHTML('afterend', '<p class="plan-newsletter-copy plan-mobile">Sign up to our newsletter to receive information about our latest offers - and get 10% off your next purchase.</p>');

  // Show the approved mobile poster on initial load; desktop retains its original slide.
  if (mobile.matches) {
    document.querySelector('.slide--first').classList.remove('is-active');
    document.querySelector('.slide--second').classList.add('is-active');
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => dot.classList.toggle('is-active', index === 1));
  }
})();
