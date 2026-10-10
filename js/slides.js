// Slide deck runtime: scaling, keyboard paging, outline rail, reveal-on-arrival.
// Keys: ↓ → Space PgDn next · ↑ ← PgUp previous · Home/End · O outline · F fullscreen

(() => {
  const deck = document.querySelector('.deck');
  const slides = [...deck.querySelectorAll('.slide')];
  const nav = document.querySelector('.rail-nav');
  const total = slides.length;
  const pad2 = (n) => String(n).padStart(2, '0');
  let current = 0;

  // ---- scale the 1600 × 900 stage to the space next to the rail
  function fit() {
    const gutter = document.body.classList.contains('no-rail') ? 0 : 28;
    const w = deck.clientWidth - gutter * 2;
    const h = deck.clientHeight - gutter * 2;
    const s = Math.min(w / 1600, h / 900);
    document.documentElement.style.setProperty('--s', s.toFixed(4));
  }

  // ---- page numbers and the outline rail are derived from the slides
  const items = [];
  let lastGroup = null;
  slides.forEach((slide, i) => {
    slide.id = slide.id || `s${i + 1}`;
    const pg = slide.querySelector('.foot .pg');
    if (pg) pg.textContent = `${pad2(i + 1)} / ${pad2(total)}`;

    const group = slide.dataset.group;
    if (group && group !== lastGroup) {
      const g = document.createElement('div');
      g.className = 'rail-group';
      g.textContent = group;
      nav.append(g);
      lastGroup = group;
    }
    const btn = document.createElement('button');
    btn.className = 'rail-item';
    btn.innerHTML = `<span class="n">${pad2(i + 1)}</span><span>${slide.dataset.title || ''}</span>`;
    btn.addEventListener('click', () => go(i));
    nav.append(btn);
    items.push(btn);
  });

  function setActive(i) {
    current = i;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === i));
    slides[i].classList.add('is-seen');
    items.forEach((b, j) => b.classList.toggle('is-active', j === i));
    items[i].scrollIntoView({ block: 'nearest' });
    history.replaceState(null, '', `#${i + 1}`);
    slides[i].dispatchEvent(new CustomEvent('slide:enter'));
  }

  function go(i, smooth = true) {
    i = Math.max(0, Math.min(total - 1, i));
    slides[i].scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    setActive(i);
  }

  // track the slide in view when the user scrolls with a trackpad or wheel
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(slides.indexOf(e.target));
      });
    },
    { root: deck, threshold: 0.6 },
  );
  slides.forEach((s) => io.observe(s));

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(k)) go(current + 1);
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(k)) go(current - 1);
    else if (k === 'Home') go(0);
    else if (k === 'End') go(total - 1);
    else if (k === 'o' || k === 'O') {
      document.body.classList.toggle('no-rail');
      fit();
      go(current, false);
    } else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } else return;
    e.preventDefault();
  });

  window.addEventListener('resize', () => {
    fit();
    go(current, false);
  });

  // iframes load only when their slide is first reached
  slides.forEach((s) =>
    s.addEventListener('slide:enter', () => {
      s.querySelectorAll('iframe[data-src]').forEach((f) => {
        f.src = f.dataset.src;
        f.removeAttribute('data-src');
      });
    }),
  );

  fit();
  const start = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(start) ? start - 1 : 0, false);
})();
