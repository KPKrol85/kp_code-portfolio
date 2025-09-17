/* ======================================================================
   SCRIPT — UI interakcje (vanilla, bez zależności)
   Sekcje:
   0) Helpers / boot
   1) Mobile nav toggle (ARIA + close-on-click + close-on-resize)
   2) Tabs: filtrowanie menu (ARIA + klawiatura)
   3) Lightbox (gallery + .dish-thumb) 
   4) Formularz rezerwacji (honeypot + walidacja HTML5 + mock)
   5) Rok w stopce
   6) Przełącznik motywu (light/dark) z pamięcią
   7) Scrollspy (podświetlanie aktywnej sekcji w menu)
   8) Scroll buttons (down/up): płynne przewijanie + stany widoczności
   9) CTA — puls tylko w viewport
   10) Smart-nav dla podstron: zamiana #menu/#galeria na URL-e
   11) MENU (page-menu): zachowanie panelu „Więcej o daniu”
   12) FAQ — ARIA sync (aria-expanded + aria-controls)
   13) Gallery filter (page-gallery)
====================================================================== */

/* ======================================================================
   0) Helpers / boot
====================================================================== */
const DEBUG=false;
const log=(...a)=>DEBUG&&console.log("[ui]",...a);

const byTestId=(id,root=document)=>root.querySelector(`[data-testid="${id}"]`);
const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));

document.documentElement.classList.remove("no-js");
if(document.body){document.body.classList.remove("no-js");}
else{window.addEventListener("DOMContentLoaded",()=>document.body&&document.body.classList.remove("no-js"),{once:true});}

/* ======================================================================
   1) Mobile nav toggle
====================================================================== */
(()=>{
  const toggle=byTestId("nav-toggle")||$(".nav-toggle");
  const nav=byTestId("site-nav")||$("#site-nav");
  if(!toggle||!nav) return;

  const mq=window.matchMedia("(min-width: 900px)");
  const setExpanded=(open)=>{
    document.body.classList.toggle("nav-open",open);
    toggle.setAttribute("aria-expanded",String(open));
  };

  // a11y: dopnij aria-controls jeśli brak
  if(!toggle.hasAttribute("aria-controls")) toggle.setAttribute("aria-controls",nav.id||"site-nav");

  // Toggle open/close
  toggle.addEventListener("click",()=>{
    setExpanded(!document.body.classList.contains("nav-open"));
  },{passive:true});

  // Delegacja: klik w link wewnątrz nav zamyka
  nav.addEventListener("click",(e)=>{
    if(e.target.closest("a")) setExpanded(false);
  },{passive:true});

  // Zmiana układu: gdy wchodzimy w desktop, domknij menu
  let lastDesktop=mq.matches;
  const onMQChange=()=>{ const nowDesktop=mq.matches; if(nowDesktop&& !lastDesktop) setExpanded(false); lastDesktop=nowDesktop; };
  mq.addEventListener?.("change",onMQChange); // nowocześnie
  // fallback dla starych przeglądarek (Safari starsze)
  window.addEventListener("resize",onMQChange,{passive:true});

  // Klik poza nav/toggle zamyka
  document.addEventListener("click",(e)=>{
    if(!document.body.classList.contains("nav-open")) return;
    const insideNav=e.target.closest("#site-nav");
    const insideBtn=e.target.closest(".nav-toggle");
    if(!insideNav && !insideBtn) setExpanded(false);
  });

  // ESC zamyka
  document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape" && document.body.classList.contains("nav-open")) setExpanded(false);
  });

  log("nav-toggle:",!!toggle,"site-nav:",!!nav);
})();


/* ======================================================================
   2) Tabs: filtrowanie menu (ARIA + klawiatura)
====================================================================== */
(()=>{
  const tabsRoot=byTestId("menu-tabs")||document;
  const tabs=$$(".tab",tabsRoot);
  const items=$$(".dish");
  if(!tabs.length) return;

  // a11y: role tylko jeśli nie ustawione
  if(tabsRoot!==document && !tabsRoot.hasAttribute("role")) tabsRoot.setAttribute("role","tablist");
  tabs.forEach(t=>{if(!t.hasAttribute("role")) t.setAttribute("role","tab");});

  const activate=(btn)=>{
    tabs.forEach(b=>{const on=b===btn; b.classList.toggle("is-active",on); b.setAttribute("aria-selected",on?"true":"false"); b.tabIndex=on?0:-1;});
    const filter=btn.dataset.filter;
    items.forEach(card=>{const show=filter==="all"||card.dataset.cat===filter; card.style.display=show?"":"none";});
  };

  // init (jeśli brak .is-active, aktywuj pierwszy)
  activate($(".tab.is-active",tabsRoot)||tabs[0]);

  // delegacja: click + Enter/Space aktywują
  tabsRoot.addEventListener("click",e=>{const btn=e.target.closest(".tab"); if(!btn||!tabs.includes(btn)) return; activate(btn);},{passive:true});
  tabsRoot.addEventListener("keydown",e=>{
    const current=e.target.closest(".tab"); if(!current||!tabs.includes(current)) return;
    const i=tabs.indexOf(current);
    const focusAt=(idx)=>tabs[(idx+tabs.length)%tabs.length].focus();
    if(e.key==="ArrowRight"){e.preventDefault();focusAt(i+1);}
    else if(e.key==="ArrowLeft"){e.preventDefault();focusAt(i-1);}
    else if(e.key==="Home"){e.preventDefault();tabs[0].focus();}
    else if(e.key==="End"){e.preventDefault();tabs[tabs.length-1].focus();}
    else if(e.key==="Enter"||e.key===" "){e.preventDefault();activate(current);}
  });
  
  log("menu-tabs:",!!byTestId("menu-tabs"),"tabs:",tabs.length);
})();


/* ======================================================================
   3) Lightbox — kontekstowa nawigacja (tylko widoczne elementy / kategoria)
====================================================================== */
(()=> {
  const lb = document.getElementById("lb") || document.querySelector(".lightbox");
  if (!lb) return;

  const isDialog = lb.nodeName === "DIALOG" && typeof lb.showModal === "function";
  const pic = lb.querySelector("picture") || lb; // fallback
  const sAvif = pic?.querySelector('source[type="image/avif"]') || document.getElementById("lb-avif");
  const sWebp = pic?.querySelector('source[type="image/webp"]') || document.getElementById("lb-webp");
  const img = pic?.querySelector("img") || document.getElementById("lb-img");
  const btnX = lb.querySelector(".lb-close") || lb.querySelector("[data-close]");
  const overlayEl = lb.querySelector(".lb-overlay");

  // --- Counter: element + aktualizacja ---
  let counter = lb.querySelector('.lb-counter');
  if (!counter) {
    counter = document.createElement('output');
    counter.className = 'lb-counter';
    counter.setAttribute('aria-live','polite');
    counter.setAttribute('aria-atomic','true');
    lb.appendChild(counter);
  }
  function updateCounter(){
    const total = currentCollection.length;
    if (!counter || total <= 1 || currentIndex < 0) {
      counter.hidden = true; counter.textContent = ''; return;
    }
    counter.hidden = false;
    const txt = `${currentIndex + 1} / ${total}`;
    counter.value = txt;            // dla <output>
    counter.textContent = txt;      // dla screenreadera i fallbacku
  }

  if (!isDialog) { lb.setAttribute("hidden",""); lb.setAttribute("aria-hidden","true"); }

  // resolve relative -> absolute URL
  const resolveUrl = (p) => {
    if (!p) return "";
    try { return new URL(p, location.href).href; } catch { return p; }
  };

  // helper: usuń query/hash i rozszerzenie (na absolutnym URL)
  const stripExt = (s = "") => {
    if (!s) return "";
    const abs = resolveUrl(s);
    const clean = abs.replace(/[?#].*$/,'');
    return clean.replace(/\.(avif|webp|jpe?g|png)$/i, '');
  };

  // bezpieczne pobranie base z elementu (data-full | href | obrazek.currentSrc | obrazek.src)
  const getBaseFromElement = (el) => {
    if (!el) return '';
    // prefer dataset (data-full)
    try {
      const d = el.dataset && el.dataset.full;
      if (d) return resolveUrl(d);
    } catch(e){}
    const a = el.getAttribute && el.getAttribute('data-full');
    if (a) return resolveUrl(a);
    const h = el.getAttribute && el.getAttribute('href');
    if (h) return resolveUrl(h);
    const imgEl = el.querySelector && el.querySelector('img');
    if (imgEl) return imgEl.currentSrc || imgEl.src || '';
    return '';
  };

  const setSources = (base, alt = "") => {
    if (!base) return;
    const b = stripExt(base);
    if (!b) return;
    if (sAvif) sAvif.srcset = `${b}.avif`;
    if (sWebp) sWebp.srcset = `${b}.webp`;
    if (img) { img.src = `${b}.jpg`; img.alt = alt || ""; }
  };

  let currentIndex = -1;
  let currentCollection = []; // tutaj trzymamy aktualną listę (widoczne elementy tej kategorii)
  let lastFocused = null;

  // zwraca widoczne elementy .g-item w danym kontenerze (.gallery-grid)
  const visibleGridItems = (grid) => {
    if (!grid) return [];
    return Array.from(grid.querySelectorAll('.g-item')).filter(el => !el.hidden && el.offsetParent !== null);
  };
  // widoczne dish-thumb (globalnie)
  const visibleThumbItems = () => Array.from(document.querySelectorAll('.dish-thumb')).filter(el => !el.hidden && el.offsetParent !== null);

  const openLB = (base, alt, index = -1, collection = []) => {
    if (!base) return;
    lastFocused = document.activeElement;

    // ustaw kolekcję (jeśli pusta, fallback do wszystkie widoczne .g-item)
    currentCollection = Array.isArray(collection) && collection.length ? collection : (visibleGridItems(document.querySelector('.gallery-grid')) || []);
    // jeśli nadal pusta — fallback do dish-thumb
    if (!currentCollection.length) currentCollection = visibleThumbItems();

    // znormalizuj base na absolutny URL
    const absBase = resolveUrl(base);
    setSources(absBase, alt);

    // ustal index na podstawie znormalizowanej ścieżki
    if (typeof index === 'number' && index >= 0) {
      currentIndex = index;
    } else {
      // find element in collection whose resolved URL equals absBase
      currentIndex = currentCollection.findIndex(el => {
        const candidate = getBaseFromElement(el) || '';
        return candidate && resolveUrl(candidate) === absBase;
      });
    }
    if (currentIndex === -1 && currentCollection.length) currentIndex = 0; // fallback

    if (isDialog) {
      try { if (!lb.open) lb.showModal(); } catch (e) { console.error(e); }
    } else {
      lb.removeAttribute("hidden");
      lb.setAttribute("aria-hidden","false");
      lb.classList.add("open");
      document.body.classList.add("no-scroll");
    }
    if (btnX && typeof btnX.focus === 'function') btnX.focus();

    updateCounter();
    preloadNeighbor(1); preloadNeighbor(-1);
  };

  const closeLB = () => {
    if (isDialog) { if (lb.open) lb.close(); }
    else {
      lb.classList.remove("open");
      document.body.classList.remove("no-scroll");
      lb.setAttribute("aria-hidden","true");
      lb.setAttribute("hidden","");
      setTimeout(()=> {
        sAvif?.removeAttribute("srcset");
        sWebp?.removeAttribute("srcset");
        img?.removeAttribute("src");
      }, 170);
    }
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    currentIndex = -1;
    currentCollection = [];
    if (counter) { counter.hidden = true; counter.textContent = ''; }
  };

  const showAtIndex = (idx) => {
    if (!currentCollection || !currentCollection.length) return;
    currentIndex = (idx + currentCollection.length) % currentCollection.length;
    const el = currentCollection[currentIndex];
    const base = getBaseFromElement(el) || "";
    const alt  = el?.querySelector('img')?.alt || el?.getAttribute('aria-label') || '';
    setSources(base, alt);
    updateCounter();
  };

  // preload helper
  function preloadNeighbor(offset) {
    if (!currentCollection.length || currentIndex === -1) return;
    const idx = (currentIndex + offset + currentCollection.length) % currentCollection.length;
    const el = currentCollection[idx];
    const raw = getBaseFromElement(el) || '';
    if (raw) {
      const p = stripExt(raw);
      // próba prefetch w formatach (webp/avif/jpg)
      const tryUrls = [`${p}.webp`, `${p}.avif`, `${p}.jpg`];
      tryUrls.forEach(u => { const im = new Image(); im.src = u; });
    }
  }

  // keyboard navigation and Esc
  const onKey = (e) => {
    if (e.key === 'Escape') { if (isDialog ? lb.open : lb.classList.contains('open')) closeLB(); return; }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); if (currentCollection.length) showAtIndex((currentIndex === -1 ? 0 : currentIndex - 1)); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); if (currentCollection.length) showAtIndex((currentIndex === -1 ? 0 : currentIndex + 1)); return; }
  };

  // Delegacja klików: miniatury dań + kafelki galerii
  document.addEventListener("click", (e) => {
    const thumb = e.target.closest(".dish-thumb");
    if (thumb) {
      const base = getBaseFromElement(thumb);
      const alt = thumb.querySelector("img")?.alt || thumb.getAttribute('aria-label') || "";
      if (thumb.tagName === "A") e.preventDefault();
      // kolekcja dla dish-thumb: wszystkie widoczne dish-thumb
      const coll = visibleThumbItems();
      const idx = coll.indexOf(thumb);
      openLB(base, alt, idx >= 0 ? idx : -1, coll);
      return;
    }
    const tile = e.target.closest(".g-item");
    if (tile) {
      const base = getBaseFromElement(tile);
      const alt = tile.querySelector("img")?.alt || tile.getAttribute('aria-label') || "";
      if (tile.tagName === "A") e.preventDefault();
      // kolekcja dla gallery: tylko widoczne elementy w tym .gallery-grid (np. aktualna kategoria)
      const grid = tile.closest('.gallery-grid');
      const coll = visibleGridItems(grid);
      const idx = coll.indexOf(tile);
      openLB(base, alt, idx >= 0 ? idx : -1, coll);
    }
  });

  // Zamknięcia
  btnX?.addEventListener("click", closeLB);
  if (overlayEl) overlayEl.addEventListener("click", closeLB);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });

  document.addEventListener("keydown", onKey);

  // === Swipe (telefony) — poziomy gest do zmiany zdjęcia ===
  (() => {
    if (!img) return;

    // Jeśli przeglądarka wspiera Pointer Events, użyj ich; inaczej fallback na touch*
    const SUPPORTS_POINTER = 'PointerEvent' in window;

    let startX = 0, startY = 0, dx = 0, dy = 0;
    let tracking = false, lockedHorizontal = false;

    // próg uznania „swipe”
    const THRESHOLD_PX = 60;
    const LOCK_ANGLE = 0.577; // ~30deg => |dy/dx| < 0.577 traktujemy jako gest poziomy

    const setTransform = (x) => {
      img.style.transition = 'none';
      img.style.transform = `translate3d(${x}px,0,0)`;
      img.style.willChange = 'transform';
    };
    const resetTransform = () => {
      img.style.transition = 'transform .18s ease';
      img.style.transform = 'translate3d(0,0,0)';
      img.addEventListener('transitionend', () => { img.style.willChange = ''; }, { once: true });
    };

    const onDown = (x, y) => {
      startX = x; startY = y; dx = 0; dy = 0;
      tracking = true; lockedHorizontal = false;
    };
    const onMove = (x, y, e) => {
      if (!tracking) return;
      dx = x - startX; dy = y - startY;

      // zablokuj kierunek po niewielkim ruchu, aby nie „walczyć” ze scrollowaniem
      if (!lockedHorizontal) {
        if (Math.abs(dx) > 8) {
          const ratio = Math.abs(dy / (dx || 1));
          lockedHorizontal = ratio < LOCK_ANGLE;
        }
      }
      if (lockedHorizontal) {
        // ważne: zablokuj przewijanie strony kiedy faktycznie przesuwamy w bok
        e?.preventDefault?.();
        setTransform(dx);
      }
    };
    const onUp = () => {
      if (!tracking) return;
      tracking = false;

      if (lockedHorizontal && Math.abs(dx) > THRESHOLD_PX && currentCollection.length) {
        const dir = dx < 0 ? +1 : -1;
        // szybki „slide-out” dla feelu
        img.style.transition = 'transform .12s ease';
        img.style.transform = `translate3d(${Math.sign(dx) * window.innerWidth * 0.25}px,0,0)`;
        // po krótkim czasie zmień slajd i zresetuj transform
        setTimeout(() => {
          showAtIndex((currentIndex === -1 ? 0 : currentIndex + dir)); // ←/→ jak strzałki
          // króciutkie wejście z przeciwnej strony
          img.style.transition = 'none';
          img.style.transform = `translate3d(${Math.sign(-dx) * 28}px,0,0)`;
          requestAnimationFrame(() => resetTransform());
          preloadNeighbor(1); preloadNeighbor(-1);
        }, 90);
      } else {
        resetTransform();
      }
    };

    if (SUPPORTS_POINTER) {
      // Pointer Events (Android/nowoczesne przeglądarki)
      img.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') onDown(e.clientX, e.clientY); }, { passive: true });
      img.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') onMove(e.clientX, e.clientY, e); }, { passive: false });
      img.addEventListener('pointerup', onUp, { passive: true });
      img.addEventListener('pointercancel', onUp, { passive: true });
    } else {
      // Fallback touch* (Safari iOS starsze)
      img.addEventListener('touchstart', (e) => {
        const t = e.touches[0]; if (!t) return;
        onDown(t.clientX, t.clientY);
      }, { passive: true });
      img.addEventListener('touchmove', (e) => {
        const t = e.touches[0]; if (!t) return;
        onMove(t.clientX, t.clientY, e);
      }, { passive: false }); // musimy móc wywołać preventDefault()
      img.addEventListener('touchend', onUp, { passive: true });
      img.addEventListener('touchcancel', onUp, { passive: true });
    }
  })();

  // expose for debug/inline usage
  window.openLB  = (base, alt, idx) => openLB(base, alt, idx);
  window.closeLB = closeLB;

  console.log("lightbox ready →", isDialog ? "<dialog>" : "<div>");
})();


/* ======================================================================
   4) Formularz rezerwacji (honeypot + walidacja HTML5 + mock)
====================================================================== */
(()=>{
  const form=byTestId("booking-form")||$("#booking-form");
  const msg=$("#form-msg");
  if(!form||!msg) return;

  const btn=form.querySelector(".btn-form");
  // a11y: dopnij aria-live/role jeśli brak
  if(!msg.hasAttribute("aria-live")) msg.setAttribute("aria-live","polite");
  if(!msg.hasAttribute("role")) msg.setAttribute("role","status");

  const setLoading=(on)=>{
    if(!btn) return;
    if(on){
      if(!btn.dataset.label) btn.dataset.label=btn.textContent.trim();
      btn.textContent="Wysyłanie…";
      btn.classList.add("is-loading");
      btn.setAttribute("aria-busy","true");
      btn.disabled=true;
    }else{
      btn.textContent=btn.dataset.label||"Wyślij rezerwację";
      btn.classList.remove("is-loading");
      btn.removeAttribute("aria-busy");
      btn.disabled=false;
    }
  };

  form.addEventListener("submit",(e)=>{
    e.preventDefault();

    // jeśli już trwa wysyłka, ignoruj (blokuje podwójne kliki)
    if(btn && btn.classList.contains("is-loading")) return;

    // Honeypot
    if(form.company && form.company.value.trim()!==""){
      msg.textContent="Wykryto bota — zgłoszenie odrzucone.";
      return;
    }

    // Walidacja HTML5
    if(!form.checkValidity()){
      form.reportValidity?.();
      msg.textContent="Uzupełnij wymagane pola.";
      return;
    }

    // START: „wysyłka”
    setLoading(true);
    msg.textContent="";

    // Tu normalnie: await fetch(...)
    const T=1000+Math.random()*200;
    const timer=setTimeout(()=>{
      try{
        // Sukces (mock)
        msg.textContent="Dziękujemy! Oddzwonimy, aby potwierdzić rezerwację.";
        form.reset();
      }finally{
        setLoading(false);
      }
    },T);

    // ostrożność: gdyby formularz został usunięty z DOM podczas timera
    form.addEventListener("reset",()=>{}, {once:true});
    form.addEventListener("submit",()=>{}, {once:true});
  });

  log("booking-form:",!!form,"btn-form:",!!btn);
})();


/* ======================================================================
   5) Rok w stopce
====================================================================== */
(()=>{
  const y=$("#year");
  if(y) y.textContent=new Date().getFullYear();
})();


/* ======================================================================
   6) Przełącznik motywu (light/dark) z pamięcią
====================================================================== */
(()=>{
  const btn=byTestId("theme-toggle")||$(".theme-toggle");
  if(!btn) return;

  const STORAGE_KEY="theme";
  const root=document.documentElement;
  const mql=window.matchMedia("(prefers-color-scheme: dark)");
  const prefersDark=mql.matches;
  const saved=localStorage.getItem(STORAGE_KEY);

  // a11y
  if(!btn.hasAttribute("role")) btn.setAttribute("role","button");

  const icon=(mode)=>mode==="dark"?"☀":"☾";

  const apply=(mode)=>{
    const ic=$(".theme-icon",btn);
    if(mode==="light"||mode==="dark"){
      root.setAttribute("data-theme",mode);
      btn.setAttribute("aria-pressed",String(mode==="dark"));
      if(ic) ic.textContent=icon(mode);
    }else{
      root.removeAttribute("data-theme");
      btn.setAttribute("aria-pressed","false");
      if(ic) ic.textContent=icon(prefersDark?"dark":"light");
    }
  };

  // init
  apply(saved??(prefersDark?"dark":"light"));

  // toggle
  btn.addEventListener("click",()=>{
    const current=root.getAttribute("data-theme")||(prefersDark?"dark":"light");
    const next=current==="dark"?"light":"dark";
    localStorage.setItem(STORAGE_KEY,next);
    apply(next);
  });

  // system changes (tylko gdy brak zapisanej preferencji)
  mql.addEventListener("change",(e)=>{
    if(!localStorage.getItem(STORAGE_KEY)) apply(e.matches?"dark":"light");
  });

  log("theme-toggle:",!!btn);
})();


/* ======================================================================
   7) Scrollspy (podświetlenie pozycji menu)
====================================================================== */
(()=>{
  const links=$$("#site-nav a[href^='#']");
  if(!links.length) return;

  const map=new Map(links.map(a=>[a.getAttribute("href").slice(1),a]));
  const setActive=(id)=>{
    if(!id||!map.has(id)) return;
    links.forEach(a=>a.removeAttribute("aria-current"));
    map.get(id)?.setAttribute("aria-current","true");
  };

  // Obserwuj tylko sekcje, do których faktycznie linkujemy
  const sections=[...document.querySelectorAll("section[id]")].filter(sec=>map.has(sec.id));
  if(!sections.length) return;

  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) setActive(e.target.id); });
  },{rootMargin:"-45% 0px -50% 0px",threshold:0});

  sections.forEach(sec=>io.observe(sec));

  // Natychmiastowe podświetlenie po kliknięciu w menu (lepszy feeling)
  const nav=document.getElementById("site-nav")||document;
  nav.addEventListener("click",(e)=>{
    const a=e.target.closest("a[href^='#']");
    if(!a||!links.includes(a)) return;
    const id=a.getAttribute("href").slice(1);
    setActive(id);
  },{passive:true});

  // Jeśli wchodzimy na stronę z hashem — ustaw od razu
  if(location.hash) setActive(location.hash.slice(1));
})();


/* ======================================================================
   8) Scroll buttons (down/up)
   - .scroll-down: przewiń na dół dokumentu
   - .scroll-up:   przewiń na górę i pokazuj po 300px
====================================================================== */
(()=>{
  const btnDown=byTestId("scroll-down")||$(".scroll-down");
  const btnUp=byTestId("scroll-up")||$(".scroll-up");
  const prefersReduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior=prefersReduce?"auto":"smooth";

  const docHeight=()=>Math.max(
    document.body.scrollHeight,document.documentElement.scrollHeight,
    document.body.offsetHeight,document.documentElement.offsetHeight,
    document.body.clientHeight,document.documentElement.clientHeight
  );

  const goBottom=()=>{ const top=Math.max(0,docHeight()-window.innerHeight); window.scrollTo({top,behavior}); };
  const goTop=()=>window.scrollTo({top:0,behavior});

  btnDown?.addEventListener("click",goBottom);
  btnUp?.addEventListener("click",goTop);

  // rAF-batched scroll handler
  let ticking=false;
  const onScrollRaw=()=>{
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(()=>{
      const y=window.scrollY||window.pageYOffset;
      if(btnDown){
        const atBottom=(window.innerHeight+y)>= (docHeight()-100);
        btnDown.classList.toggle("is-hidden",atBottom);
      }
      if(btnUp) btnUp.classList.toggle("is-visible",y>300);
      ticking=false;
    });
  };

  // init + bind
  onScrollRaw();
  window.addEventListener("scroll",onScrollRaw,{passive:true});

  log("scroll-down:",!!btnDown,"scroll-up:",!!btnUp);
})();

/* ======================================================================
   9) CTA — puls tylko w viewport
====================================================================== */
(()=>{
  const ctas=document.querySelectorAll(".btn-cta");
  if(!ctas.length) return;

  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      entry.target.classList.toggle("cta-inview",entry.isIntersecting);
    });
  },{threshold:0.2}); // min. 20% widoczne

  ctas.forEach(btn=>io.observe(btn));
})();

/* ======================================================================
   10) Smart-nav dla podstron: zamiana #menu/#galeria na URL-e
====================================================================== */
(()=>{
  // Na stronie głównej zostawiamy anchor-scroll
  const path=location.pathname;
  const isHome=/(?:^|\/)(index\.html)?$/.test(path) || path.endsWith("/");
  if(isHome) return;

  const map={"#menu":"menu.html","#galeria":"galeria.html"};
  const links=document.querySelectorAll(".site-nav a[href^='#']");
  links.forEach(a=>{
    const to=map[a.getAttribute("href")||""];
    if(to) a.setAttribute("href",to);
  });
})();

/* ======================================================================
   NAV — ustawienie aktywnego linku w nawigacji (aria-current) na podstronach
   - działa dla: galeria.html, menu.html, index.html#galeria itd.
   ====================================================================== */
(function(){
  const nav = document.querySelector('.site-nav');
  if(!nav) return;
  const links = Array.from(nav.querySelectorAll('a'));
  // aktualny plik (np. "galeria.html") -> "galeria"
  const file = location.pathname.split('/').pop() || '';
  const page = file.replace('.html',''); // "" | "galeria" | "menu" | "index"
  const hash = (location.hash || '').replace('#',''); // "" | "galeria"

  // wyczyść stare stany
  links.forEach(l => l.removeAttribute('aria-current'));

  // funkcja pomocnicza - czy href linku zawiera szukaną frazę
  const hrefMatches = (a, token) => {
    if(!token) return false;
    const href = a.getAttribute('href') || '';
    // uwzględnij zarówno "#galeria", "galeria.html" jak i "/folder/galeria.html"
    return href.includes('#' + token) || href.endsWith(token + '.html') || href.includes('/' + token + '.html') || href.includes('/' + token);
  };

  // 1) próbujemy dopasować po nazwie pliku (np. galeria.html -> link zawiera 'galeria')
  if(page){
    for(const a of links){
      if(hrefMatches(a, page)){
        a.setAttribute('aria-current','page');
        return;
      }
    }
  }

  // 2) fallback: jeśli istnieje hash (#galeria) - dopasuj po hash
  if(hash){
    for(const a of links){
      if(hrefMatches(a, hash)){
        a.setAttribute('aria-current','page');
        return;
      }
    }
  }

  // 3) ostatni fallback: jeśli jesteśmy na index.html i bez hash, ustaw domyślny (np. "Menu" jeśli potrzebne)
  // (opcjonalne — odkomentuj i dostosuj jeśli chcesz domyślne zachowanie)
  // const defaultText = 'Menu';
  // for(const a of links){
  //   if(a.textContent.trim() === defaultText){ a.setAttribute('aria-current','page'); break; }
  // }
})();


/* ======================================================================
   11) MENU (page-menu): zachowanie panelu „Więcej o daniu”
   - klik poza panel zamyka wszystkie otwarte
   - Esc zamyka wszystkie
   - akordeon: otwarcie jednego zamyka inne
====================================================================== */
(()=>{
  if(!document.body.classList.contains("page-menu")) return;

  // 1) Klik poza .dish-more zamyka otwarte panele
  document.addEventListener("click",(e)=>{
    if(e.target.closest(".dish-more")) return; // klik w środku — ignoruj
    const openDetails=document.querySelectorAll(".dish-more[open]");
    if(!openDetails.length) return;
    openDetails.forEach(d=>d.removeAttribute("open"));
  },{passive:true});

  // 2) Esc zamyka wszystkie otwarte panele
  document.addEventListener("keydown",(e)=>{
    if(e.key!=="Escape") return;
    document.querySelectorAll(".dish-more[open]").forEach(d=>d.removeAttribute("open"));
  });

  // 3) Akordeon: otwarcie jednego zamyka pozostałe
  document.addEventListener("toggle",(e)=>{
    const el=e.target;
    if(!el.matches?.(".dish-more")) return;
    if(el.open){
      document.querySelectorAll(".dish-more[open]").forEach(d=>{ if(d!==el) d.removeAttribute("open"); });
    }
  });
})();


/* ======================================================================
   12) FAQ — ARIA sync (aria-expanded + aria-controls)
====================================================================== */
(()=>{
  // Obsłuż zarówno #faq jak i .faq na wszelki wypadek
  const root=document.getElementById("faq")||document.querySelector(".faq");
  if(!root) return;

  const panels=root.querySelectorAll("details");
  if(!panels.length) return;

  panels.forEach((d,i)=>{
    const s=d.querySelector("summary");
    if(!s) return;

    // Jeśli mamy panel treści, dopnij id i aria-controls
    const panel=d.querySelector(".content");
    if(panel && !panel.id) panel.id=`faqp-${i}-${Math.random().toString(36).slice(2)}`;
    if(panel && !s.hasAttribute("aria-controls")) s.setAttribute("aria-controls",panel.id);

    const sync=()=>s.setAttribute("aria-expanded",d.hasAttribute("open")?"true":"false");
    d.addEventListener("toggle",sync);
    sync();
  });
})();


/* ======================================================================
   13) Gallery filter (page-gallery) — accessible tabs (roving tabindex + manual activation)
   ====================================================================== */
(function () {
  if (!document.body.classList.contains('page-gallery')) return; // tylko ta podstrona

  const tabsWrap = document.querySelector('.tabs');
  if (!tabsWrap) return;

  const tabs  = Array.from(tabsWrap.querySelectorAll('.tab'));
  const items = Array.from(document.querySelectorAll('.gallery-grid .g-item'));

  // Pokaż/ukryj według aktywnego filtra
  function applyFilter(value){
    items.forEach(el=>{
      const cat = el.dataset.cat || el.dataset.filter || '';
      el.hidden = value ? (cat !== value) : false; // bez value — pokaż wszystko
    });
  }

  // Ustaw aria-selected (nie aktywuje filtra samodzielnie)
  function setActiveTab(btn){
    tabs.forEach(t=>t.setAttribute('aria-selected', String(t===btn)));
  }

  // --- ACCESSIBLE TABS SETUP ---
  // inicjalizacja roving tabindex i ról
  function initTabs(){
    tabs.forEach((t, i) => {
      t.setAttribute('role','tab');
      // jeśli w HTML ustawiono aria-selected, uwzględnij to; inaczej pierwszy jako active
      const selected = t.getAttribute('aria-selected') === 'true';
      t.setAttribute('tabindex', selected ? '0' : (i === 0 ? '0' : '-1'));
      if (!t.hasAttribute('aria-selected')) t.setAttribute('aria-selected', String(i===0));
    });
  }

  // funkcja aktywacji: aktualizuje aria, tabindex i filtruje (applyFilter)
  function activateTab(tab){
    setActiveTab(tab);
    tabs.forEach(t => t.setAttribute('tabindex', t === tab ? '0' : '-1'));
    const value = tab.dataset.filter || '';
    applyFilter(value);
    tab.focus();
  }

  // pomoc: przesunięcie fokusu z wrap-around
  function focusIndex(idx){
    const i = (idx + tabs.length) % tabs.length;
    tabs[i].focus();
  }

  // keyboard: manual activation zgodnie z WAI-ARIA (fokus != aktywacja)
  tabsWrap.addEventListener('keydown', (e)=>{
    const key = e.key;
    const activeEl = document.activeElement;
    const idx = tabs.indexOf(activeEl);
    if (idx === -1) return; // nie na tabie

    if (key === 'ArrowRight' || key === 'ArrowLeft'){
      e.preventDefault();
      const next = key === 'ArrowRight' ? idx + 1 : idx - 1;
      focusIndex(next); // tylko focus
      return;
    }

    if (key === 'Home'){
      e.preventDefault();
      focusIndex(0);
      return;
    }

    if (key === 'End'){
      e.preventDefault();
      focusIndex(tabs.length - 1);
      return;
    }

    if (key === 'Enter' || key === ' ' || key === 'Spacebar'){
      e.preventDefault();
      // aktywuj fokusowany tab
      activateTab(activeEl);
      return;
    }

    if (key === 'Escape'){
      activeEl.blur();
      return;
    }
  });

  // click: aktywacja od razu (mysz/pointer)
  tabs.forEach(t=>{
    // upewnij się, że nie zostają duplikaty listenerów — jeśli wklejasz zamiennik to stare zostały usunięte
    t.addEventListener('click', (ev) => {
      activateTab(t);
    });
    // opcjonalnie: pointerdown pozostawiamy pusty, by wspierać model pointerów
    t.addEventListener('pointerdown', ()=>{});
  });

  // Start: jeśli w HTML jest aria-selected="true" -> aktywuj go; inaczej pierwszy
  const pre = tabs.find(t => t.getAttribute('aria-selected') === 'true');
  initTabs();
  if(pre) activateTab(pre); else activateTab(tabs[0]);
})();







































