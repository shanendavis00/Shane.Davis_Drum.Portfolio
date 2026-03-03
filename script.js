(() => {
  const THEME_KEY = 'sd_theme';

  // apply saved or default theme
  function applyTheme(t) {
    if (t === 'light') {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);

  // theme toggle via any logo element with id starting 'logoToggle'
  document.querySelectorAll('[id^="logoToggle"]').forEach(el => {
    el.addEventListener('click', () => {
      const current = document.body.classList.contains('light') ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  });

  // general year injection (works on pages with #year, #year2, #year3)
  document.querySelectorAll('[id^="year"]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // BACK TO TOP (only if present)
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backToTop.style.display = 'flex';
      else backToTop.style.display = 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  }

  // SIDEBAR DROPDOWNS (handle multiple instances)
  function wiredrop(genreBtnId, genreListId) {
    const btn = document.getElementById(genreBtnId);
    const list = document.getElementById(genreListId);
    if (!btn || !list) return;
    let open = false;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      open = !open;
      list.style.display = open ? 'flex' : 'none';
    });
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !list.contains(e.target)) {
        list.style.display = 'none';
        open = false;
      }
    });
  }
  wiredrop('genreBtn','genreList');
  wiredrop('genreBtn2','genreList2');
  wiredrop('genreBtn3','genreList3');

 function makeCard(song) {
  const c = document.createElement('div');
  c.className = 'card';

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'card-body';

  const title = document.createElement('h4');
  title.className = 'card-title';
  title.textContent = song.title || 'Untitled';

  const meta = document.createElement('div');
  meta.className = 'card-meta';
  meta.textContent =
    (song.date || '') +
    (song.date && song.description ? ' • ' : '') +
    (song.description ? song.description : '');

  const embedWrap = document.createElement('div');

  // Thumbnail as clickable link (no YouTube embed)
  if (song.youtube) {
  const thumb = document.createElement('button');
  thumb.type = 'button';
  thumb.className = 'tiled-thumbnail thumb-embed';
  thumb.style.backgroundImage = `url(${song.thumbnail || 'thumbnails/placeholder.jpg'})`;
  thumb.setAttribute('aria-label', `Play ${song.title || 'video'}`);

  
  // optional: play icon overlay
  const play = document.createElement('span');
  play.className = 'play-badge';
  play.innerHTML = '▶';
  thumb.appendChild(play);

 thumb.addEventListener('click', () => {
  if (!song.youtube) return;

  // Convert embed URL → normal watch URL
  const embedUrl = song.youtube.trim();

  const videoIdMatch = embedUrl.match(/embed\/([^?&]+)/);
  if (!videoIdMatch) return;

  const videoId = videoIdMatch[1];
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  window.open(watchUrl, '_blank', 'noopener');
});
  embedWrap.appendChild(thumb);
  } else if (song.audio) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.style.width = '100%';

    const src = document.createElement('source');
    src.src = song.audio;
    audio.appendChild(src);

    embedWrap.appendChild(audio);
  }

  bodyDiv.appendChild(title);
  bodyDiv.appendChild(meta);
  bodyDiv.appendChild(embedWrap);

  c.appendChild(bodyDiv);
  return c;
}

  function populateSongsOnGenrePage(){
    if (typeof songs === 'undefined') return;
    Object.keys(songs).forEach(genreKey => {
      const container = document.querySelector(`.cards[data-genre="${genreKey}"]`);
      if (!container) return;
      container.innerHTML = '';
      songs[genreKey].forEach(song => {
        container.appendChild(makeCard(song));
      });
    });
  }

  if (document.body && document.body.contains(document.querySelector('.genre-section'))) {
    populateSongsOnGenrePage();

    // internal links in genre page (genre dropdown)
    document.querySelectorAll('.genre-list a').forEach(a => {
      a.addEventListener('click',(e)=>{
        const href = a.getAttribute('href') || ('#'+a.dataset.target);
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
        }
      });
    });
  }

  // GALLERY: populate images + video row if gallery.js present
  function populateGallery(){
    if (typeof galleryImages === 'undefined' && typeof galleryVideos === 'undefined') return;
    const grid = document.getElementById('galleryGrid');
    if (grid && Array.isArray(galleryImages)) {
      grid.innerHTML = '';
      galleryImages.forEach((src,i) => {
        const w = document.createElement('div');
        w.className = 'masonry-item';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Gallery '+(i+1);
        img.dataset.index = i;
        w.appendChild(img);
        grid.appendChild(w);
      });

      // lightbox wiring
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightboxImg');
      const lightboxClose = document.getElementById('lightboxClose');
      const lightboxPrev = document.getElementById('lightboxPrev');
      const lightboxNext = document.getElementById('lightboxNext');
      let idx = 0;
      function openLB(i){ idx = i; lightboxImg.src = galleryImages[idx]; lightbox.style.display='flex'; lightbox.setAttribute('aria-hidden','false');}
      function closeLB(){ lightbox.style.display='none'; lightbox.setAttribute('aria-hidden','true'); }
      function prevLB(){ idx=(idx-1+galleryImages.length)%galleryImages.length; lightboxImg.src = galleryImages[idx]; }
      function nextLB(){ idx=(idx+1)%galleryImages.length; lightboxImg.src = galleryImages[idx]; }

      grid.addEventListener('click',(e)=>{
        if (e.target && e.target.tagName==='IMG'){
          openLB(parseInt(e.target.dataset.index,10));
        }
      });
      if (lightboxClose) lightboxClose.addEventListener('click', closeLB);
      if (lightboxPrev) lightboxPrev.addEventListener('click', prevLB);
      if (lightboxNext) lightboxNext.addEventListener('click', nextLB);
      document.addEventListener('keydown',(e)=>{
        if (lightbox && lightbox.style.display==='flex'){
          if (e.key==='ArrowLeft') prevLB();
          if (e.key==='ArrowRight') nextLB();
          if (e.key==='Escape') closeLB();
        }
      });
    }

    const row = document.getElementById('videoRow');
    if (row && Array.isArray(galleryVideos)) {
      row.innerHTML = '';
      galleryVideos.forEach(src=>{
        const wrap = document.createElement('div');
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
        row.appendChild(wrap);
      });
    }
  }

  if (document.getElementById('galleryGrid') || document.getElementById('videoRow')) {
    populateGallery();
  }

  // sync contact to footers (if present)
  function syncContact(){
    const mid = document.getElementById('contactPhone');
    if (!mid) return;
    const phone = mid.textContent;
    const email = document.getElementById('contactEmail')?.textContent || '';
    document.querySelectorAll('[id^="footerPhone"]').forEach(el=>el.textContent = phone);
    document.querySelectorAll('[id^="footerEmail"]').forEach(el=>el.textContent = email);
  }
  syncContact();

})();
  // PHONE HAMBURGER NAV (only affects phone due to CSS)
  const sidebar = document.querySelector('.sidebar');
  const menuBtn = document.querySelector('.menu-toggle');

  if (sidebar && menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = sidebar.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // close when tapping a link
    sidebar.querySelectorAll('.nav a').forEach(a => {
      a.addEventListener('click', () => {
        sidebar.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // close when tapping outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target)) {
        sidebar.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }