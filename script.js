// ===================================
// The Greeting Fairy — Site Scripts
// ===================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const navContainer = navMenu.parentElement; // original desktop parent

  // Dim backdrop — tapping it closes the drawer
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  // Inject close button once (stays inside menu regardless of placement)
  const closeLi = document.createElement('li');
  closeLi.className = 'nav-close-item';
  closeLi.innerHTML = `
    <button class="nav-menu-close" aria-label="Close navigation">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M2 2L20 20M20 2L2 20"/>
      </svg>
    </button>`;
  navMenu.prepend(closeLi);

  function closeMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Move navMenu to <body> on mobile (escapes navbar's backdrop-filter stacking
  // context so the drawer background renders correctly on Safari/WebKit).
  // Restore it to the navbar on desktop so the horizontal nav works normally.
  const mobileBreakpoint = window.matchMedia('(max-width: 768px)');

  function handleMenuPlacement(e) {
    if (e.matches) {
      // Mobile: move to body
      if (navMenu.parentElement !== document.body) {
        document.body.appendChild(navMenu);
      }
    } else {
      // Desktop: restore to navbar
      if (navMenu.parentElement !== navContainer) {
        navContainer.appendChild(navMenu);
        closeMenu();
      }
    }
  }

  mobileBreakpoint.addEventListener('change', handleMenuPlacement);
  handleMenuPlacement(mobileBreakpoint); // run once on load

  closeLi.querySelector('.nav-menu-close').addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  navToggle.addEventListener('click', () => {
    navMenu.classList.contains('active') ? closeMenu() : openMenu();
  });

  // Close mobile menu when a nav link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Scroll Animations ---
  const fadeElements = document.querySelectorAll(
    '.service-card, .gallery-item, .testimonial-card, .section-header, ' +
    '.about-content, .contact-wrapper, .occasion-tag, .stat, ' +
    '.process-step, .review-badge'
  );

  fadeElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.closest(
          '.services-grid, .gallery-grid, .testimonials-grid, .occasion-tags, .about-stats, .process-grid'
        );
        const delay = parent
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
          : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));

  // --- Contact Form (Formspree) ---
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        btn.textContent = 'Message Sent!';
        btn.style.background = '#7ea87e';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      btn.textContent = 'Oops — try again';
      btn.style.background = '#d4556a';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all open items
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        openItem.classList.remove('active');
        const openBtn = openItem.querySelector('.faq-question');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Balloon Color Visualizer ---
  const COLOR_FAMILIES = [
    {
      label: 'Whites & Neutrals',
      colors: [
        { name: 'White',      hex: '#FFFFFF' },
        { name: 'Ivory',      hex: '#F5F0DC' },
        { name: 'Champagne',  hex: '#F7E0B0' },
        { name: 'Sand',       hex: '#D4BC94' },
      ]
    },
    {
      label: 'Metallics',
      colors: [
        { name: 'Gold',       hex: '#D4AF37' },
        { name: 'Silver',     hex: '#BEBEBE' },
        { name: 'Rose Gold',  hex: '#C9878A' },
        { name: 'Bronze',     hex: '#B87333' },
      ]
    },
    {
      label: 'Pinks & Corals',
      colors: [
        { name: 'Blush',      hex: '#F4BEC4' },
        { name: 'Baby Pink',  hex: '#FFD1DC' },
        { name: 'Hot Pink',   hex: '#FF69B4' },
        { name: 'Fuchsia',    hex: '#E91E8C' },
        { name: 'Coral',      hex: '#FF7F6B' },
        { name: 'Dusty Rose', hex: '#C08080' },
        { name: 'Mauve',      hex: '#9E6B7B' },
      ]
    },
    {
      label: 'Reds',
      colors: [
        { name: 'Red',        hex: '#E63946' },
        { name: 'Cherry',     hex: '#C41C34' },
        { name: 'Burgundy',   hex: '#800020' },
        { name: 'Cranberry',  hex: '#9E1B32' },
      ]
    },
    {
      label: 'Oranges & Peaches',
      colors: [
        { name: 'Peach',         hex: '#FFCBA4' },
        { name: 'Orange',        hex: '#FF8C00' },
        { name: 'Terracotta',    hex: '#C16B4A' },
        { name: 'Burnt Orange',  hex: '#CC5500' },
      ]
    },
    {
      label: 'Yellows',
      colors: [
        { name: 'Butter',    hex: '#FFF3A0' },
        { name: 'Lemon',     hex: '#FFF44F' },
        { name: 'Yellow',    hex: '#FFD700' },
        { name: 'Marigold',  hex: '#ECA83A' },
      ]
    },
    {
      label: 'Greens',
      colors: [
        { name: 'Mint',    hex: '#98E4C5' },
        { name: 'Sage',    hex: '#9DC183' },
        { name: 'Lime',    hex: '#52C41A' },
        { name: 'Emerald', hex: '#50C878' },
        { name: 'Forest',  hex: '#228B22' },
        { name: 'Olive',   hex: '#808000' },
      ]
    },
    {
      label: 'Blues',
      colors: [
        { name: 'Baby Blue',   hex: '#AED6F1' },
        { name: 'Sky Blue',    hex: '#87CEEB' },
        { name: 'Turquoise',   hex: '#40CFC0' },
        { name: 'Teal',        hex: '#008B8B' },
        { name: 'Royal Blue',  hex: '#4169E1' },
        { name: 'Navy',        hex: '#1B2A5C' },
      ]
    },
    {
      label: 'Purples',
      colors: [
        { name: 'Lavender',     hex: '#C4A8E0' },
        { name: 'Lilac',        hex: '#C8A2C8' },
        { name: 'Purple',       hex: '#9B59B6' },
        { name: 'Deep Purple',  hex: '#5B2D8E' },
        { name: 'Plum',         hex: '#8B1FA8' },
      ]
    },
    {
      label: 'Darks',
      colors: [
        { name: 'Charcoal', hex: '#36454F' },
        { name: 'Black',    hex: '#111111' },
      ]
    },
  ];

  const MAX_COLORS = 3;
  let selectedColors = [];

  const colorFilterTabsEl = document.getElementById('colorFilterTabs');
  const colorSwatchGridEl = document.getElementById('colorSwatchGrid');
  const selectedChipsEl   = document.getElementById('selectedChips');
  const paletteCountEl    = document.getElementById('paletteCount');
  const garlandSvgEl      = document.getElementById('garlandSvg');
  const sendPaletteBtn    = document.getElementById('sendPaletteBtn');
  const clearPaletteBtn   = document.getElementById('clearPaletteBtn');

  if (colorSwatchGridEl) {
    let activeFamily = 'All';

    // Build filter tabs
    const allFamilyNames = ['All', ...COLOR_FAMILIES.map(f => f.label)];
    allFamilyNames.forEach(name => {
      const tab = document.createElement('button');
      tab.className = 'filter-tab' + (name === 'All' ? ' active' : '');
      tab.textContent = name;
      tab.addEventListener('click', () => {
        activeFamily = name;
        colorFilterTabsEl.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderSwatchGrid();
      });
      colorFilterTabsEl.appendChild(tab);
    });

    // Build all swatches up front (hidden/shown by filter)
    const allSwatchEls = [];
    COLOR_FAMILIES.forEach(family => {
      family.colors.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'color-swatch';
        btn.style.background = color.hex;
        btn.title = color.name;
        btn.setAttribute('aria-label', color.name);
        btn.dataset.hex = color.hex;
        btn.dataset.family = family.label;
        btn.addEventListener('click', () => toggleColor(color, btn));
        allSwatchEls.push(btn);
        colorSwatchGridEl.appendChild(btn);
      });
    });

    function renderSwatchGrid() {
      allSwatchEls.forEach(btn => {
        btn.style.display = (activeFamily === 'All' || btn.dataset.family === activeFamily) ? '' : 'none';
      });
    }

    function toggleColor(color, btn) {
      const idx = selectedColors.findIndex(c => c.hex === color.hex);
      if (idx > -1) {
        selectedColors.splice(idx, 1);
        btn.classList.remove('selected');
      } else {
        if (selectedColors.length >= MAX_COLORS) return;
        selectedColors.push(color);
        btn.classList.add('selected');
      }
      updateVisualizer();
    }

    function updateVisualizer() {
      paletteCountEl.textContent = `${selectedColors.length} of ${MAX_COLORS} selected`;

      if (selectedColors.length === 0) {
        selectedChipsEl.innerHTML = '<span class="empty-chips-hint">Tap a color below to start</span>';
      } else {
        selectedChipsEl.innerHTML = '';
        selectedColors.forEach(color => {
          const lightHexes = ['#FFFFFF','#FFF44F','#FFF3A0','#FFD1DC','#F5F0DC','#F7E0B0','#FFCBA4','#AED6F1','#87CEEB','#98E4C5','#F4BEC4','#C4A8E0','#C8A2C8'];
          const isLight = lightHexes.includes(color.hex);
          const chip = document.createElement('div');
          chip.className = 'selected-chip';
          chip.innerHTML = `
            <span class="chip-dot" style="background:${color.hex}; border-color:${isLight ? 'rgba(0,0,0,0.18)' : 'transparent'}"></span>
            <span>${color.name}</span>
            <button class="chip-remove" aria-label="Remove ${color.name}">&times;</button>
          `;
          chip.querySelector('.chip-remove').addEventListener('click', () => {
            selectedColors = selectedColors.filter(c => c.hex !== color.hex);
            const swatch = colorSwatchGridEl.querySelector(`.color-swatch[data-hex="${CSS.escape(color.hex)}"]`);
            if (swatch) swatch.classList.remove('selected');
            updateVisualizer();
          });
          selectedChipsEl.appendChild(chip);
        });
      }

      sendPaletteBtn.disabled = selectedColors.length === 0;
      renderGarland(selectedColors);
    }

    // --- Color helpers for 3D balloon shading ---
    function hexToRgb(hex) {
      const h = hex.replace('#', '');
      return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
      ];
    }
    function rgbToHex(r, g, b) {
      const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
      return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('');
    }
    function lighten(hex, amount) {
      const [r, g, b] = hexToRgb(hex);
      return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
    }
    function darken(hex, amount) {
      const [r, g, b] = hexToRgb(hex);
      return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
    }

    // Deterministic pseudo-random — keeps layout stable for a given color count
    function makeRand(seed) {
      let s = seed;
      return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
    }

    // ----- Garland 3D state — stored across drag/repaint cycles -----
    // Each balloon has 3D position (x, y, z); we project to 2D every redraw
    // based on the current yaw so users can drag to orbit the cluster.
    let garlandBalloons = [];
    let garlandDefs = '';
    let garlandYaw = 0;       // rotation around vertical axis (radians)
    const GARLAND_W = 560;
    const GARLAND_H = 280;
    const GARLAND_CENTER_X = 280;

    function renderGarland(colors) {
      if (colors.length === 0) {
        garlandBalloons = [];
        garlandDefs = '';
        garlandSvgEl.innerHTML = `<text x="280" y="145" text-anchor="middle" fill="#C8B4C8" font-family="Poppins, sans-serif" font-size="13" font-weight="400">Select colors to preview your garland ✨</text>`;
        return;
      }

      // Bashify-style flowing diagonal cluster — sweeping S-curve from
      // upper-right to lower-left with hero, medium, and accent balloons
      // scattered organically in 3D space.
      const rand = makeRand(7919); // stable seed → consistent layout

      // Cubic Bézier sample point on the diagonal S-curve
      function curvePoint(t) {
        const p0 = [495, 65];   // start: upper right
        const p1 = [380, 210];  // ctrl 1: dips low
        const p2 = [200, 70];   // ctrl 2: rises again
        const p3 = [85, 215];   // end: lower left
        const u = 1 - t;
        const x = u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0];
        const y = u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1];
        return [x, y];
      }

      // ----- Build <defs>: radial gradient per color + soft drop-shadow filter
      garlandDefs = `
        <filter id="garland-ground-shadow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="7"/>
        </filter>`;

      const colorGradients = new Map();
      colors.forEach((c, idx) => {
        const id = `garland-3d-${idx}`;
        colorGradients.set(c.hex, id);
        const [r, g, b] = hexToRgb(c.hex);
        const brightness = (r + g + b) / 3;
        const isVeryLight = brightness > 230;
        const isMedLight = brightness > 180;

        const lightStop = lighten(c.hex, isVeryLight ? 0.04 : isMedLight ? 0.40 : 0.55);
        const midStop   = isVeryLight ? c.hex : lighten(c.hex, 0.05);
        const darkStop  = darken(c.hex, isVeryLight ? 0.10 : isMedLight ? 0.16 : 0.22);

        garlandDefs += `
          <radialGradient id="${id}" cx="30%" cy="25%" r="78%" fx="28%" fy="22%">
            <stop offset="0%"  stop-color="${lightStop}"/>
            <stop offset="42%" stop-color="${midStop}"/>
            <stop offset="100%" stop-color="${darkStop}"/>
          </radialGradient>`;
      });

      // ----- Generate balloons in 3 size tiers with 3D scatter
      garlandBalloons = [];
      let colorIdx = 0;
      const nextColor = () => colors[(colorIdx++) % colors.length];

      // Spherical scatter helper — picks a random 3D direction at distance `off`
      function addBalloon(t, r, scatterMin, scatterRange) {
        const [bx, by] = curvePoint(t);
        const az = rand() * Math.PI * 2;
        const pitch = (rand() - 0.5) * Math.PI;
        const off = scatterMin + rand() * scatterRange;
        const dx = Math.cos(az) * Math.cos(pitch) * off;
        const dy = Math.sin(pitch) * off;
        const dz = Math.sin(az) * Math.cos(pitch) * off;
        const color = nextColor();
        garlandBalloons.push({
          x: bx + dx, y: by + dy, z: dz,
          r,
          gradId: colorGradients.get(color.hex),
        });
      }

      // Hero balloons (8) — big, on the curve
      for (let i = 0; i < 8; i++) {
        const t = (i + 0.5) / 8;
        addBalloon(t, 26 + rand() * 12, 0, 12);
      }
      // Medium balloons (32) — scatter around the curve
      for (let i = 0; i < 32; i++) {
        addBalloon(rand(), 13 + rand() * 9, 8, 30);
      }
      // Small accent balloons (40) — wider scatter, fill in gaps
      for (let i = 0; i < 40; i++) {
        addBalloon(rand(), 5 + rand() * 7, 12, 42);
      }

      drawGarland();
    }

    // Project balloons through current yaw, sort by depth, render to SVG.
    // Called on every drag step — just math + innerHTML, no regeneration.
    function drawGarland() {
      if (garlandBalloons.length === 0) return;

      const cosY = Math.cos(garlandYaw);
      const sinY = Math.sin(garlandYaw);

      // Project each balloon: rotate around Y axis, apply slight perspective
      const projected = garlandBalloons.map(b => {
        const relX = b.x - GARLAND_CENTER_X;
        const rotX = relX * cosY + b.z * sinY;
        const rotZ = -relX * sinY + b.z * cosY;
        // Perspective: balloons farther from viewer (positive z) shrink slightly
        const persp = 1 - rotZ * 0.0014;
        // Depth-based opacity for the very back balloons
        const op = rotZ > 30 ? Math.max(0.55, 1 - (rotZ - 30) * 0.006) : 1;
        return {
          gradId: b.gradId,
          sx: rotX + GARLAND_CENTER_X,
          sy: b.y,
          sr: b.r * persp,
          sortZ: rotZ,
          opacity: op,
        };
      });

      // Painter's algorithm: draw far-away balloons first, near ones last
      projected.sort((a, b) => b.sortZ - a.sortZ);

      // Ground shadow stays fixed in screen space (it's the cluster's shadow on the floor)
      let body = `
        <ellipse cx="280" cy="248" rx="190" ry="13"
                 fill="rgba(0, 0, 0, 0.18)"
                 filter="url(#garland-ground-shadow)"/>`;

      projected.forEach(b => {
        const cx = b.sx.toFixed(1);
        const cy = b.sy.toFixed(1);
        const rx = b.sr.toFixed(1);
        const ry = (b.sr * 1.10).toFixed(1);

        // Highlight stays fixed in screen-space (light source is upper-left of viewport)
        const hx  = (b.sx - b.sr * 0.30).toFixed(1);
        const hy  = (b.sy - b.sr * 0.40).toFixed(1);
        const hrx = (b.sr * 0.28).toFixed(1);
        const hry = (b.sr * 0.32).toFixed(1);
        const dx  = (b.sx - b.sr * 0.42).toFixed(1);
        const dy  = (b.sy - b.sr * 0.50).toFixed(1);
        const dr  = (b.sr * 0.08).toFixed(1);

        body += `
          <g opacity="${b.opacity.toFixed(2)}">
            <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"
                     fill="url(#${b.gradId})"
                     stroke="rgba(0,0,0,0.10)" stroke-width="0.4"/>
            <ellipse cx="${hx}" cy="${hy}" rx="${hrx}" ry="${hry}"
                     fill="rgba(255,255,255,0.45)"/>
            <circle cx="${dx}" cy="${dy}" r="${dr}"
                    fill="rgba(255,255,255,0.85)"/>
          </g>`;
      });

      garlandSvgEl.innerHTML = `<defs>${garlandDefs}</defs>${body}`;
    }

    // ----- Pointer drag → orbit the cluster around its vertical axis -----
    let isDraggingGarland = false;
    let lastPointerX = 0;
    let drawRafPending = false;
    let hasDragged = false; // hide the "drag to rotate" hint after first interaction

    function scheduleDraw() {
      if (drawRafPending) return;
      drawRafPending = true;
      requestAnimationFrame(() => {
        drawRafPending = false;
        drawGarland();
      });
    }

    garlandSvgEl.addEventListener('pointerdown', (e) => {
      if (garlandBalloons.length === 0) return;
      isDraggingGarland = true;
      lastPointerX = e.clientX;
      try { garlandSvgEl.setPointerCapture(e.pointerId); } catch (_) {}
      garlandSvgEl.classList.add('grabbing');
      if (!hasDragged) {
        hasDragged = true;
        const hint = document.getElementById('garlandDragHint');
        if (hint) hint.classList.add('hidden');
      }
      e.preventDefault();
    });

    garlandSvgEl.addEventListener('pointermove', (e) => {
      if (!isDraggingGarland) return;
      const dx = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      garlandYaw += dx * 0.012; // sensitivity: ~180° per ~260px of drag
      scheduleDraw();
    });

    function endGarlandDrag(e) {
      if (!isDraggingGarland) return;
      isDraggingGarland = false;
      garlandSvgEl.classList.remove('grabbing');
      if (e && e.pointerId !== undefined) {
        try { garlandSvgEl.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    }
    garlandSvgEl.addEventListener('pointerup', endGarlandDrag);
    garlandSvgEl.addEventListener('pointercancel', endGarlandDrag);
    garlandSvgEl.addEventListener('pointerleave', endGarlandDrag);

    // Send palette to contact form
    sendPaletteBtn.addEventListener('click', () => {
      const names = selectedColors.map(c => c.name).join(', ');
      const msgField = document.getElementById('message');
      if (msgField) {
        const prefix = `My color palette: ${names}\n\n`;
        msgField.value = msgField.value ? prefix + msgField.value : prefix;
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });

    // Clear palette
    clearPaletteBtn.addEventListener('click', () => {
      selectedColors = [];
      allSwatchEls.forEach(s => s.classList.remove('selected'));
      updateVisualizer();
    });

    // Initial render
    renderSwatchGrid();
  }

  // --- Gallery Lightbox ---
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.9);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; padding: 40px;
        opacity: 0; transition: opacity 0.3s ease;
      `;

      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.alt = img.alt;
      fullImg.style.cssText = `
        max-width: 90%; max-height: 90vh;
        object-fit: contain; border-radius: 16px;
        transform: scale(0.95); transition: transform 0.3s ease;
      `;

      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        fullImg.style.transform = 'scale(1)';
      });

      overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        fullImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.body.style.overflow = '';
        }, 300);
      });
    });
  });

});
