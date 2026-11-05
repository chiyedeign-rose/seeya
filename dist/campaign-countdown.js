(() => {
  function getRemaining(deadline, now = Date.now()) {
    const end = Date.parse(deadline);
    if (!Number.isFinite(end)) return null;
    const remaining = Math.max(0, end - now);
    const minutes = Math.floor(remaining / 60000);
    return {days: Math.floor(minutes / 1440), hours: Math.floor(minutes / 60) % 24, minutes: minutes % 60, ended: remaining === 0};
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {getRemaining};
  if (typeof document === 'undefined') return;
  const pad = value => String(value).padStart(2, '0');
  function initialize(scope = document) {
    scope.querySelectorAll('[data-campaign-end]').forEach(banner => {
      if (banner.dataset.countdownInitialized) return;
      banner.dataset.countdownInitialized = 'true';
      const timer = document.createElement('span');
      timer.className = 'campaign-countdown';
      timer.setAttribute('role', 'timer');
      timer.setAttribute('aria-live', 'off');
      banner.appendChild(timer);
      let interval;
      const render = () => {
        const remaining = getRemaining(banner.dataset.campaignEnd);
        if (!remaining) {timer.hidden = true; clearInterval(interval); return;}
        const text = remaining.ended ? 'Offer has ended' : `Offer ends in ${pad(remaining.days)} days ${pad(remaining.hours)} hrs ${pad(remaining.minutes)} mins`;
        if (timer.textContent !== text) timer.textContent = text;
        if (remaining.ended) clearInterval(interval);
      };
      render();
      if (!getRemaining(banner.dataset.campaignEnd)?.ended) interval = setInterval(() => {if (!banner.isConnected) clearInterval(interval); else render();}, 1000);
    });
  }
  initialize();
  document.addEventListener('shopify:section:load', event => initialize(event.target));
})();
