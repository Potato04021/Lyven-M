// ================= brillo que sigue el cursor =================
const glow = document.getElementById('glow');
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  glow.style.setProperty('--mx', x + '%');
  glow.style.setProperty('--my', y + '%');
});

// ================= estrellas de fondo =================
const starsContainer = document.getElementById('stars');
const STAR_COUNT = 70;
for (let i = 0; i < STAR_COUNT; i++) {
  const s = document.createElement('span');
  s.style.top = Math.random() * 100 + '%';
  s.style.left = Math.random() * 100 + '%';
  s.style.animationDelay = (Math.random() * 4) + 's';
  s.style.animationDuration = (3 + Math.random() * 3) + 's';
  starsContainer.appendChild(s);
}

// ================= reveal on scroll =================
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ================= partículas decorativas al hacer clic =================
const PARTICLE_SHAPES = [
  '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z" fill="#e8c987"/></svg>',
  '<svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="7" fill="#8ec9f0"/></svg>',
  '<svg viewBox="0 0 24 24" width="12" height="12"><circle cx="12" cy="12" r="6" fill="#eef2ff"/></svg>',
  '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C13 6 18 7 22 8C18 9 13 10 12 14C11 10 6 9 2 8C6 7 11 6 12 2Z" fill="#a479df"/></svg>'
];

function burst(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 8;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.innerHTML = PARTICLE_SHAPES[Math.floor(Math.random() * PARTICLE_SHAPES.length)];
    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5 - 0.25);
    const dist = 46 + Math.random() * 48;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    p.style.setProperty('--rot', (Math.random() * 300 - 150) + 'deg');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }
}

document.querySelectorAll('.link-pill').forEach(pill => {
  pill.addEventListener('click', (e) => {
    burst(pill);
    const href = pill.getAttribute('href') || '';
    const internal = !pill.target && href && href.charAt(0) !== '#';
    if (internal && !(e.metaKey || e.ctrlKey || e.shiftKey)) {
      e.preventDefault();                         // deja ver las chispas antes de cambiar de página
      setTimeout(() => { location.href = pill.href; }, 380);
    }
  });
});

// ================= la estrella violeta dibuja "lyven.zl" en cursiva =================
(function penWrite() {
  const NS = 'http://www.w3.org/2000/svg';
  const penA = document.getElementById('penA');
  const penB = document.getElementById('penB');
  const glowA = document.getElementById('glowA');
  const glowB = document.getElementById('glowB');
  const dot = document.getElementById('penDot');
  const star = document.getElementById('penStar');
  const trail = document.getElementById('trail');
  if (!penA || !penB || !star) return;

  const lenA = penA.getTotalLength();
  const lenB = penB.getTotalLength();
  const dotX = parseFloat(dot.getAttribute('cx'));
  const dotY = parseFloat(dot.getAttribute('cy'));

  const setDraw = (path, glow, len, p) => {
    [path, glow].forEach(el => {
      el.setAttribute('stroke-dasharray', len);
      el.setAttribute('stroke-dashoffset', len * (1 - p));
    });
  };

  // Sin movimiento (accesibilidad): se muestra todo ya dibujado.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setDraw(penA, glowA, lenA, 1);
    setDraw(penB, glowB, lenB, 1);
    dot.style.opacity = 1;
    return;
  }

  setDraw(penA, glowA, lenA, 0);
  setDraw(penB, glowB, lenB, 0);

  const DELAY = 700;          // espera inicial (deja entrar estrellas y energía)
  const DRAW_MS = 3800;       // tiempo total de escritura
  const HOP_MS = 260;         // saltito de la estrella hacia el punto y de vuelta
  const segA = DRAW_MS * lenA / (lenA + lenB);
  const segB = DRAW_MS - segA;
  const total = segA + HOP_MS * 2 + segB;
  const ease = x => -(Math.cos(Math.PI * x) - 1) / 2;

  const startA = penA.getPointAtLength(0);
  const endA = penA.getPointAtLength(lenA);
  const startB = penB.getPointAtLength(0);

  let lastTrail = 0;
  let t0 = null;

  function place(x, y, elapsed) {
    star.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(elapsed * 0.25).toFixed(1)})`);
    star.style.opacity = 1;
  }

  function spawnTrail(x, y, now) {
    if (now - lastTrail < 34) return;
    lastTrail = now;
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', (x + (Math.random() * 5 - 2.5)).toFixed(2));
    c.setAttribute('cy', (y + (Math.random() * 5 - 2.5)).toFixed(2));
    c.setAttribute('r', (0.9 + Math.random() * 1.7).toFixed(2));
    c.setAttribute('fill', Math.random() > 0.4 ? '#c9a8f2' : '#f3ecff');
    c.setAttribute('class', 'trail');
    trail.appendChild(c);
    setTimeout(() => c.remove(), 1000);
  }

  function frame(now) {
    if (t0 === null) t0 = now;
    const e = now - t0;
    let x, y;

    if (e < segA) {                                   // 1) escribe "lyven"
      const p = ease(e / segA);
      setDraw(penA, glowA, lenA, p);
      const pt = penA.getPointAtLength(p * lenA);
      x = pt.x; y = pt.y;
    } else if (e < segA + HOP_MS) {                   // 2) salta al punto
      setDraw(penA, glowA, lenA, 1);
      const u = (e - segA) / HOP_MS;
      x = endA.x + (dotX - endA.x) * ease(u);
      y = endA.y + (dotY - endA.y) * ease(u) - 16 * Math.sin(Math.PI * u);
      dot.style.opacity = u > 0.7 ? 1 : 0;
    } else if (e < segA + HOP_MS * 2) {               // 3) salta hacia la "z"
      const u = (e - segA - HOP_MS) / HOP_MS;
      x = dotX + (startB.x - dotX) * ease(u);
      y = dotY + (startB.y - dotY) * ease(u) - 16 * Math.sin(Math.PI * u);
    } else if (e < total) {                           // 4) escribe "zl"
      const p = ease((e - segA - HOP_MS * 2) / segB);
      setDraw(penB, glowB, lenB, p);
      const pt = penB.getPointAtLength(p * lenB);
      x = pt.x; y = pt.y;
    } else {                                          // final
      setDraw(penB, glowB, lenB, 1);
      const end = penB.getPointAtLength(lenB);
      place(end.x, end.y, e);
      star.classList.add('rest');
      burst(star);
      return;
    }

    place(x, y, e);
    spawnTrail(x, y, now);
    requestAnimationFrame(frame);
  }

  setTimeout(() => requestAnimationFrame(frame), DELAY);
})();
