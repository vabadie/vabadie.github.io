(function () {
  // Hero scroll detection for blur fade
  const hero = document.querySelector('.hero');
  const heroImg = hero && hero.querySelector('.hero-img');
  function updateHero() {
    if (!hero || !heroImg) return;
    const rect = hero.getBoundingClientRect();
    const threshold = Math.min(window.innerHeight * 0.55, heroImg.offsetHeight * 0.7);
    if (rect.bottom < threshold) {
      hero.classList.add('hero--scrolled');
    } else {
      hero.classList.remove('hero--scrolled');
    }
  }
  window.addEventListener('scroll', updateHero, { passive: true });
  window.addEventListener('resize', updateHero);
  document.addEventListener('DOMContentLoaded', updateHero);
  updateHero();
  // Footer year
  const now = new Date().getFullYear();
  const yearNowEl = document.getElementById('yearNow');
  if (yearNowEl) yearNowEl.textContent = now;

  // Theme toggle with localStorage
  const THEME_KEY = 'site-theme';
  const prefer = localStorage.getItem(THEME_KEY);
  if (prefer) document.documentElement.setAttribute('data-theme', prefer);
  const toggleBtn = document.getElementById('themeToggle');
  toggleBtn && toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });

  // Publications helpers
  const pubs = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS.slice() : [];
  const pubsList = document.getElementById('pubsList');
  const yearFilter = document.getElementById('yearFilter');
  const pubSearch = document.getElementById('pubSearch');
  const tagContainer = document.getElementById('pubTags');

  function uniqueYears(list) { return [...new Set(list.map(p => p.year))].sort((a, b) => b - a); }
  function uniqueTags(list) {
    const all = new Set();
    for (const p of list) {
      const tags = (p.tags || []).map(t => String(t).trim()).filter(Boolean);
      tags.forEach(t => all.add(t));
    }
    return [...all].sort((a,b) => a.localeCompare(b));
  }

  function renderYears() {
    if (!yearFilter) return;
    const years = uniqueYears(pubs);
    for (const y of years) {
      const opt = document.createElement('option');
      opt.value = String(y);
      opt.textContent = String(y);
      yearFilter.appendChild(opt);
    }
  }

  function renderTags() {
    if (!tagContainer) return;
    const tags = uniqueTags(pubs);
    tagContainer.innerHTML = '';
    for (const t of tags) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'tag';
      el.textContent = t;
      el.dataset.tag = t;
      el.addEventListener('click', () => {
        el.classList.toggle('active');
        doFilter();
      });
      tagContainer.appendChild(el);
    }
  }

  function link(label, href) {
    const a = document.createElement('a');
    a.textContent = label;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  }

  function render(list) {
    if (!pubsList) return;
    pubsList.innerHTML = '';
    if (!list.length) {
      const p = document.createElement('p');
      p.textContent = 'No publications found.';
      pubsList.appendChild(p);
      return;
    }

    const byYear = list.reduce((acc, p) => {
      acc[p.year] = acc[p.year] || [];
      acc[p.year].push(p);
      return acc;
    }, {});
    const years = Object.keys(byYear).map(Number).sort((a,b) => b - a);

    for (const y of years) {
      const h3 = document.createElement('h3');
      h3.textContent = y;
      pubsList.appendChild(h3);
      for (const p of byYear[y]) {
        const item = document.createElement('article');
        item.className = 'pub-item';

        const title = document.createElement('div');
        title.className = 'pub-title';
        title.textContent = p.title;

        const meta = document.createElement('div');
        meta.className = 'pub-meta';
        const note = p.note ? ` — ${p.note}` : '';
        const venue = p.venue ? ` — ${p.venue}` : '';
        meta.textContent = `${p.authors || ''}${venue}${note}`;

        const links = document.createElement('div');
        links.className = 'pub-links';
        const map = p.links || {};
        if (map.doi) links.appendChild(link('DOI', map.doi));
        if (map.arxiv) links.appendChild(link('arXiv', map.arxiv));
        if (map.pdf) links.appendChild(link('PDF', map.pdf));
        if (map.code) links.appendChild(link('Code', map.code));
        if (map.slides) links.appendChild(link('Slides', map.slides));
        if (map.website) links.appendChild(link('Website', map.website));

        item.appendChild(title);
        item.appendChild(meta);
        if (links.childNodes.length) item.appendChild(links);

        pubsList.appendChild(item);
      }
    }
  }

  function doFilter() {
    let list = pubs.slice();
    if (yearFilter && yearFilter.value !== 'all') {
      const y = Number(yearFilter.value);
      list = list.filter(p => p.year === y);
    }
    const q = (pubSearch && pubSearch.value || '').toLowerCase().trim();
    if (q) {
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.authors || '').toLowerCase().includes(q)
      );
    }
    if (tagContainer) {
      const active = [...tagContainer.querySelectorAll('.tag.active')].map(b => b.dataset.tag);
      if (active.length) {
        list = list.filter(p => {
          const tags = (p.tags || []).map(t => String(t));
          return active.every(t => tags.includes(t));
        });
      }
    }
    render(list);
  }

  // Initialize publications UI if present
  if (pubsList) {
    renderYears();
    renderTags();
    render(pubs);
    yearFilter && yearFilter.addEventListener('change', doFilter);
    pubSearch && pubSearch.addEventListener('input', doFilter);
  }

  // Expose simple API for other pages
  window.Pubs = {
    render,
    filter: doFilter,
  };
})();
