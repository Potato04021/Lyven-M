// ================= visor de catálogos (solo lectura, sin botón de descarga) =================
(function () {
  const viewer = document.getElementById('viewer');
  const titleEl = document.getElementById('viewerTitle');
  const data = (typeof CATALOGS !== 'undefined') ? CATALOGS : {};
  const key = new URLSearchParams(location.search).get('c');
  const cat = (key && Object.prototype.hasOwnProperty.call(data, key)) ? data[key] : null;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;     // textContent: nunca se inserta HTML de fuera
    return n;
  };

  viewer.textContent = '';

  // ---- catálogo no encontrado: se muestra la lista de los disponibles ----
  if (!cat) {
    titleEl.textContent = 'Catálogos';
    viewer.appendChild(el('p', 'viewer-msg', 'Elige un catálogo para verlo:'));
    const stack = el('div', 'link-stack');
    Object.keys(data).forEach(k => {
      const a = el('a', 'link-pill', data[k].title);
      a.href = 'catalogo.html?c=' + encodeURIComponent(k);
      stack.appendChild(a);
    });
    viewer.appendChild(stack);
    return;
  }

  titleEl.textContent = cat.title;
  document.title = cat.title + ' — Lyven.zl';

  // ---- modo Drive: el archivo se ve dentro de la página ----
  if (cat.mode === 'drive' && /^[A-Za-z0-9_-]+$/.test(cat.driveId || '')) {
    const box = el('div', 'drive-frame');
    const frame = document.createElement('iframe');
    frame.src = 'https://drive.google.com/file/d/' + cat.driveId + '/preview';
    frame.title = cat.title;
    frame.setAttribute('loading', 'lazy');
    frame.setAttribute('referrerpolicy', 'no-referrer');
    // sandbox SIN allow-downloads ni allow-popups: el navegador bloquea descargas y el "abrir en pestaña nueva"
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    box.appendChild(frame);
    box.appendChild(el('div', 'popout-shield'));   // tapa el ícono de "abrir en Drive"
    viewer.appendChild(box);
  }

  // ---- modo imágenes: páginas guardadas en tu propio sitio ----
  else if (cat.mode === 'images' && Array.isArray(cat.pages)) {
    cat.pages.forEach((src, i) => {
      if (typeof src !== 'string' || /^(https?:)?\/\//i.test(src) || src.indexOf('..') !== -1) return;
      const wrap = el('div', 'page-wrap' + (cat.watermark ? ' wm' : ''));
      const img = document.createElement('img');
      img.src = src;
      img.alt = cat.title + ' — página ' + (i + 1);
      img.loading = 'lazy';
      img.draggable = false;
      wrap.appendChild(img);
      viewer.appendChild(wrap);
    });
  }

  else {
    viewer.appendChild(el('p', 'viewer-msg', 'Este catálogo no está disponible por ahora.'));
  }

  // ---- disuasión de descarga / copia ----
  ['contextmenu', 'dragstart', 'copy', 'cut'].forEach(ev =>
    viewer.addEventListener(ev, e => e.preventDefault())
  );
  window.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'p' || k === 'u')) e.preventDefault();
  });
})();
