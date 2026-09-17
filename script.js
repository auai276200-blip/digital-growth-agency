(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------------------------------------------------
  // Premium visual layer: 3D depth, capability imagery + polish
  // ------------------------------------------------------------
  const enhancementCSS = `
    .service-card,.visual-card,.cap-pill,.process-item{transform-style:preserve-3d;will-change:transform}
    .service-card{--rx:0deg;--ry:0deg;--mx:50%;--my:50%;transform:perspective(1100px) rotateX(var(--rx)) rotateY(var(--ry));transition:transform .18s ease-out,background .45s ease,border-color .35s ease;}
    .service-card:before{content:'';position:absolute;inset:-1px;pointer-events:none;background:radial-gradient(circle at var(--mx) var(--my),rgba(167,139,250,.18),transparent 30%);opacity:0;transition:opacity .3s;z-index:0}
    .service-card:hover:before{opacity:1}
    .service-card>*{position:relative;z-index:2}
    .service-image{transform:translateZ(22px);box-shadow:0 18px 45px rgba(0,0,0,.22)}
    .service-icon{transform:translateZ(38px);transition:transform .35s ease}
    .service-card:hover .service-icon{transform:translateZ(48px) rotate(8deg) scale(1.08)}
    .cap-pill{position:relative;overflow:hidden;min-height:150px;background-size:cover;background-position:center;isolation:isolate}
    .cap-pill:before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(5,6,11,.15),rgba(5,6,11,.94) 78%);z-index:-1;transition:opacity .45s,transform .6s}
    .cap-pill:hover:before{opacity:.72;transform:scale(1.04)}
    .cap-image{position:absolute!important;inset:0;width:100%;height:100%;object-fit:cover;opacity:.34;z-index:-2!important;transition:transform .8s cubic-bezier(.2,.7,.2,1),opacity .5s;filter:saturate(.72) contrast(1.08)}
    .cap-pill:hover .cap-image{transform:scale(1.09);opacity:.52}
    .cap-pill>span,.cap-pill>.cap-label{position:relative;z-index:3}
    .cap-pill .cap-label{display:flex;flex-direction:column;gap:6px;max-width:78%;font-size:18px}
    .cap-pill .cap-label small{font:9px 'DM Mono',monospace;color:#a9acb8;letter-spacing:1px;text-transform:uppercase}
    .process-item{position:relative;overflow:hidden}
    .process-item:after{content:'';position:absolute;left:0;bottom:0;width:100%;height:1px;background:linear-gradient(90deg,transparent,#9b91ff,transparent);transform:scaleX(0);transform-origin:left;transition:transform .5s}
    .process-item:hover:after{transform:scaleX(1)}
    .hero canvas{filter:drop-shadow(0 0 22px rgba(123,112,217,.12))}
    .hero-grid{animation:gridFloat 18s ease-in-out infinite alternate}
    @keyframes gridFloat{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(-18px,12px,0) scale(1.025)}}
    .statement-orbit{box-shadow:0 0 100px rgba(117,103,255,.07) inset,0 0 80px rgba(94,231,255,.035)}
    .cta-sphere{transform-style:preserve-3d;will-change:transform}
    .cta-sphere:after{content:'';position:absolute;inset:15%;border:1px solid rgba(255,255,255,.08);border-radius:50%;transform:translateZ(30px) rotateX(68deg);animation:sphereRing 8s linear infinite}
    @keyframes sphereRing{to{transform:translateZ(30px) rotateX(68deg) rotateZ(360deg)}}
    .whatsapp-float{animation:waPulse 3s ease-in-out infinite}
    @keyframes waPulse{50%{box-shadow:0 14px 50px rgba(37,211,102,.16)}}
    .mobile-menu-panel{position:fixed;inset:86px 0 auto 0;z-index:39;padding:20px 22px 28px;background:rgba(5,6,11,.94);backdrop-filter:blur(22px);border-bottom:1px solid rgba(255,255,255,.1);display:none}
    .mobile-menu-panel.open{display:grid;gap:4px}
    .mobile-menu-panel a{padding:15px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:14px;color:#c9cbd4}
    .mobile-menu-panel a:last-child{color:#fff}
    body.menu-open{overflow:hidden}
    @media(max-width:900px){.service-card{transform:none!important}.cap-pill{min-height:135px}.mobile-menu-panel{inset-top:76px}}
    @media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
  `;
  const style = document.createElement('style');
  style.id = 'premium-enhancements';
  style.textContent = enhancementCSS;
  document.head.appendChild(style);

  // Loader — always finishes even if an animation library fails.
  const loader = $('.loader');
  const line = $('.loader-line i');
  if (window.gsap && line && loader) {
    gsap.to(line, { width: '100%', duration: 1.05, ease: 'power2.inOut' });
    gsap.to(loader, { autoAlpha: 0, duration: .65, delay: 1.15, ease: 'power2.inOut', onComplete: () => loader.remove() });
  } else if (loader) {
    setTimeout(() => loader.remove(), 900);
  }

  // Add a real mobile navigation instead of leaving the hamburger inert.
  const menuButton = $('.menu');
  const nav = $('.nav');
  if (menuButton && nav) {
    const panel = document.createElement('div');
    panel.className = 'mobile-menu-panel';
    panel.innerHTML = `
      <a href="#services">Services</a>
      <a href="#approach">Approach</a>
      <a href="#capabilities">Capabilities</a>
      <a href="#contact">Contact</a>
      <a href="https://wa.me/923341903823?text=Hi%20Digital%20Growth%20Agency%2C%20I%27d%20like%20to%20start%20a%20project." target="_blank" rel="noopener">Start a project ↗</a>`;
    nav.insertAdjacentElement('afterend', panel);
    const closeMenu = () => { panel.classList.remove('open'); document.body.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded','false'); };
    menuButton.setAttribute('aria-expanded','false');
    menuButton.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    $$('a', panel).forEach(a => a.addEventListener('click', closeMenu));
    addEventListener('resize', () => { if (innerWidth > 900) closeMenu(); });
  }

  // Hero 3D particle sphere / constellation.
  const canvas = $('#hero-canvas');
  if (window.THREE && canvas) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
      camera.position.z = 4.7;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.setSize(innerWidth, innerHeight);
      const group = new THREE.Group();
      scene.add(group);

      const count = innerWidth < 700 ? 560 : 1000;
      const pos = new Float32Array(count * 3);
      const pts = [];
      for (let i = 0; i < count; i++) {
        const u = Math.random(), v = Math.random();
        const theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
        const r = 1.55 + (Math.random() - .5) * .22;
        const x = r * Math.sin(phi) * Math.cos(theta), y = r * Math.sin(phi) * Math.sin(theta), z = r * Math.cos(phi);
        pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color: 0xd9d7ff, size: .018, transparent: true, opacity: .82, sizeAttenuation: true });
      group.add(new THREE.Points(geo, mat));

      const linePositions = [], maxDist = .48;
      for (let i = 0; i < count; i += 2) {
        for (let j = i + 1; j < Math.min(i + 55, count); j++) {
          if (pts[i].distanceTo(pts[j]) < maxDist) linePositions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
      const lgeo = new THREE.BufferGeometry();
      lgeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      group.add(new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({ color: 0x8b82ff, transparent: true, opacity: .12 })));
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18, 2), new THREE.MeshBasicMaterial({ color: 0x7b70d9, wireframe: true, transparent: true, opacity: .07 }));
      group.add(core);

      const mouse = { x: 0, y: 0 };
      addEventListener('pointermove', e => { mouse.x = (e.clientX / innerWidth - .5) * 2; mouse.y = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
      addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7)); });
      let t = 0;
      const render = () => {
        t += reduceMotion ? .001 : .003;
        group.rotation.y += reduceMotion ? .0003 : .0018;
        group.rotation.x = Math.sin(t) * .06;
        group.position.x += (mouse.x * .18 - group.position.x) * .025;
        group.position.y += (-mouse.y * .12 - group.position.y) * .025;
        core.rotation.x += .002; core.rotation.y -= .001;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      };
      render();
    } catch (err) {
      console.warn('3D hero fallback enabled:', err);
    }
  }

  // Capability images. The image references were found through web image search;
  // the UI uses them as visual references with a dark overlay for readability.
  const capabilityImages = [
    'https://cdn.prod.website-files.com/665d764211c8c75a684bcf9d/6948ea7093233eb11598a435_6948dcc212e0ddc125e6b31e-1766384671474.jpeg',
    'https://cdn.prod.website-files.com/65b129d335c4e7fef9218829/65dde71b0e4da9e61fc8c7bf_Return%20on%20ad%20spend%20formulas%20for%20DTCs.png',
    'https://cdn.prod.website-files.com/68406adf095720647c8103d0/695e6bc61536f8d73f32c7d7_article-2bd0af3b-6562-41c9-997a-high-quality-realistic-photograph-of-a-creative--0-omz16i.jpeg',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&fm=jpg&q=80&w=1200',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&fm=jpg&q=80&w=1200',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&fm=jpg&q=80&w=1200',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&fm=jpg&q=80&w=1200',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&fm=jpg&q=80&w=1200'
  ];
  const capabilityLabels = ['Content Systems','Paid Growth','Brand Strategy','Social Growth','Analytics','Conversion','Creative Systems','AI Workflows'];
  $$('.cap-pill').forEach((pill, i) => {
    if (capabilityImages[i]) {
      const img = document.createElement('img');
      img.className = 'cap-image';
      img.src = capabilityImages[i];
      img.alt = capabilityLabels[i] || 'Digital growth capability';
      img.loading = 'lazy';
      img.decoding = 'async';
      pill.prepend(img);
      if (!$('.cap-label', pill)) {
        const textNodes = [...pill.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
        if (textNodes.length) {
          const label = document.createElement('div');
          label.className = 'cap-label';
          label.textContent = textNodes.map(n => n.textContent.trim()).join(' ');
          textNodes.forEach(n => n.remove());
          pill.prepend(label);
        }
      }
    }
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance.
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, { opacity: 1, y: 0, duration: .95, ease: 'power3.out', delay: .12 + i * .07 });
    });

    // Smooth section reveals.
    gsap.utils.toArray('.section-head,.process-item,.visual-card,.cap-pill').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: reduceMotion ? 0 : 28 }, {
        opacity: 1, y: 0, duration: .8, delay: Math.min(i * .035, .24), ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });

    // 3D service cards — disabled on touch devices for stability/performance.
    if (matchMedia('(pointer:fine)').matches && !reduceMotion) {
      $$('.service-card').forEach(card => {
        gsap.fromTo(card, { opacity: 0, y: 38 }, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
        card.addEventListener('pointermove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5;
          const y = (e.clientY - r.top) / r.height - .5;
          card.style.setProperty('--rx', `${y * -5}deg`);
          card.style.setProperty('--ry', `${x * 5}deg`);
          card.style.setProperty('--mx', `${(x + .5) * 100}%`);
          card.style.setProperty('--my', `${(y + .5) * 100}%`);
        });
        card.addEventListener('pointerleave', () => { card.style.setProperty('--rx','0deg'); card.style.setProperty('--ry','0deg'); });
      });
    } else {
      gsap.utils.toArray('.service-card').forEach(card => gsap.fromTo(card, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } }));
    }

    // Continuous depth motion.
    if (!reduceMotion) {
      gsap.to('.statement-orbit', { rotation: 360, duration: 42, repeat: -1, ease: 'none' });
      gsap.to('.cta-sphere', { y: -34, rotate: 2, scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      gsap.to('.hero-grid', { yPercent: 8, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      $$('.cap-pill').forEach((pill, i) => gsap.to(pill, { y: i % 2 ? -10 : 8, scrollTrigger: { trigger: pill, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }));
    }

    // Magnetic CTAs.
    if (matchMedia('(pointer:fine)').matches && !reduceMotion) {
      $$('.magnetic').forEach(btn => {
        btn.addEventListener('pointermove', e => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .14, y: (e.clientY - r.top - r.height / 2) * .14, duration: .3, overwrite: true });
        });
        btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: .5, overwrite: true }));
      });
    }
  }

  // Robust smooth anchor scrolling, including sticky header offset.
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      const target = id && $(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + scrollY - 78;
      scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  // Custom cursor.
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  if (dot && ring && matchMedia('(pointer:fine)').matches && !reduceMotion) {
    addEventListener('pointermove', e => {
      dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`;
      ring.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 350, fill: 'forwards' });
    }, { passive: true });
    $$('a,.service-card,.cap-pill,.visual-card').forEach(el => {
      el.addEventListener('mouseenter', () => { ring.style.width = '52px'; ring.style.height = '52px'; });
      el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; });
    });
  }

  // Prevent broken-image areas from looking empty if a remote image ever fails.
  $$('img').forEach(img => img.addEventListener('error', () => { img.style.opacity = '.08'; }, { once: true }));
})();
