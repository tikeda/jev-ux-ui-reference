(() => {
  const links = [...document.querySelectorAll('.entry-toc a[href^="#"]')];
  if (!links.length) return;

  const items = links
    .map((link) => {
      const id = decodeURIComponent(link.hash.slice(1));
      const target = document.getElementById(id);
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  let frame = 0;

  const updateCurrent = () => {
    frame = 0;
    const marker = window.scrollY + Math.min(window.innerHeight * 0.3, 240);
    let current = items[0];

    for (const item of items) {
      if (item.target.offsetTop <= marker) current = item;
      else break;
    }

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = items[items.length - 1];
    }

    for (const item of items) {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  };

  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(updateCurrent);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('hashchange', requestUpdate);
  updateCurrent();
})();
