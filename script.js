/**
 * Jundiá Sorvetes Campinas Cambuí — v12
 * ─────────────────────────────────────────────────────────────────────────────
 * Sistema Completo de Animações (CSS Keyframes + Framer Motion UMD + SVG Wave)
 *   • Sem bloqueio por prefers-reduced-motion do Windows
 *   • Replay garantido nas entradas de página (title-home, title-sabores,
 *     title-lojas, casquinha-element, icecream-bowl-tight, wave-divider)
 *   • Ondulação real-time em senoide na borda branca curvada (.wave-divider)
 *   • Scroll-reveal em TODOS os elementos ao descer e subir a página
 *   • Interações elásticas de hover e clique (squash & stretch)
 * ─────────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  const Motion = window.Motion;
  const canAnimate = Boolean(Motion && typeof Motion.animate === 'function');

  // ── Páginas ────────────────────────────────────────────────────────────────
  const homePage    = document.getElementById('homePage');
  const saboresPage = document.getElementById('saboresPage');
  const lojasPage   = document.getElementById('lojasPage');
  const allPages    = [homePage, saboresPage, lojasPage].filter(Boolean);

  // ── Botões e Links de Navegação ────────────────────────────────────────────
  const navSaboresBtn           = document.getElementById('navSaboresBtn');
  const navLojasBtn             = document.getElementById('navLojasBtn');
  const navSobreBtn             = document.getElementById('navSobreBtn');
  const btnVerSaboresHero       = document.getElementById('btnVerSaboresHero');
  const btnExplorarSaboresSobre = document.getElementById('btnExplorarSaboresSobre');
  const btnVoltarHome           = document.getElementById('btnVoltarHome');
  const logoHomeBtn             = document.getElementById('logoHomeBtn');
  const footerSobreLink         = document.getElementById('footerSobreLink');
  const footerSaboresLink       = document.getElementById('footerSaboresLink');
  const footerLojasLink         = document.getElementById('footerLojasLink');

  let isTransitioning = false;
  const EASE_SPRING = [0.34, 1.56, 0.64, 1];
  const EASE_SMOOTH = [0.22, 1, 0.36, 1];

  // ─────────────────────────────────────────────────────────────────────────
  // 1. REPLAY GARANTIDO DAS ANIMAÇÕES DO HERO (Casquinha, Pote, Títulos, Onda)
  // ─────────────────────────────────────────────────────────────────────────
  function replayHeroAnimations(pageEl) {
    if (!pageEl) return;

    const heroTargets = pageEl.querySelectorAll(
      '.hero-title-graphic, .hero-subtitle, .hero-cta-wrapper, .lojas-hero-search, .icecream-img, .wave-divider'
    );

    heroTargets.forEach((el) => {
      el.style.animation = 'none';
      void el.offsetWidth; // Força reflow para reiniciar @keyframes do 0%
      el.style.animation = '';
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. ANIMAÇÃO FLUIDA EM TEMPO REAL NA BORDA CURVA BRANCA (.wave-divider)
  // ─────────────────────────────────────────────────────────────────────────
  const wavePaths = document.querySelectorAll('.wave-divider svg path');
  if (wavePaths.length) {
    let startTime = performance.now();

    function animateWaves(now) {
      const t = (now - startTime) * 0.001; // segundos

      wavePaths.forEach((path, idx) => {
        const phase = idx * 1.3;
        const y0   = 54 + Math.sin(t * 2.4 + phase) * 18;
        const c1y  = 82 + Math.cos(t * 2.0 + phase + 0.5) * 16;
        const c2y  = 22 + Math.sin(t * 2.6 + phase + 1.2) * 20;
        const midY = 62 + Math.cos(t * 2.2 + phase + 2.0) * 16;
        const c3y  = 84 + Math.sin(t * 2.5 + phase + 2.8) * 15;
        const c4y  = 34 + Math.cos(t * 2.1 + phase + 3.5) * 18;
        const endY = 54 + Math.sin(t * 2.3 + phase + 4.2) * 16;

        path.setAttribute(
          'd',
          `M0,${y0.toFixed(1)} C340,${c1y.toFixed(1)} 620,${c2y.toFixed(1)} 960,${midY.toFixed(1)} C1190,${c3y.toFixed(1)} 1350,${c4y.toFixed(1)} 1440,${endY.toFixed(1)} L1440,120 L0,120 Z`
        );
      });

      requestAnimationFrame(animateWaves);
    }

    requestAnimationFrame(animateWaves);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. SCROLL REVEAL BIDIRECIONAL — Anima tudo ao descer a página
  // ─────────────────────────────────────────────────────────────────────────
  const pageObservers = new Map();

  function setupScrollReveal(pageEl) {
    if (!pageEl) return null;

    const targets = pageEl.querySelectorAll('[data-animate]');
    if (!targets.length) return null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const delay = parseFloat(el.getAttribute('data-delay') || '0');

          if (entry.isIntersecting) {
            el.style.animationDelay = `${delay}s`;
            el.classList.add('is-visible');
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.88) {
            // Quando o elemento sai por baixo da tela (usuário subiu), reseta
            // para animar novamente quando o usuário descer!
            el.classList.remove('is-visible');
            el.style.animationDelay = '';
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    targets.forEach((el) => {
      const type = el.getAttribute('data-animate');
      if (type && type.startsWith('hero-')) {
        el.style.opacity = '1';
        return;
      }
      observer.observe(el);
    });

    return observer;
  }

  function resetScrollReveal(pageEl) {
    if (!pageEl) return;
    pageEl.querySelectorAll('[data-animate]').forEach((el) => {
      const type = el.getAttribute('data-animate');
      if (type && type.startsWith('hero-')) return;
      el.classList.remove('is-visible');
      el.style.animationDelay = '';
    });
  }

  function attachObserver(pageEl) {
    if (!pageEl) return;
    if (pageObservers.has(pageEl)) {
      pageObservers.get(pageEl).disconnect();
      pageObservers.delete(pageEl);
    }
    const obs = setupScrollReveal(pageEl);
    if (obs) pageObservers.set(pageEl, obs);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. FOOTER REVEAL AO DESCER A PÁGINA
  // ─────────────────────────────────────────────────────────────────────────
  function setupFooterReveal() {
    const footerItems = document.querySelectorAll(
      '.footer-left-brand, .footer-center-links, .social-blue-buttons'
    );
    footerItems.forEach((el, i) => {
      el.setAttribute('data-animate', 'fade-up');
      el.setAttribute('data-delay', (i * 0.12).toString());
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const delay = parseFloat(el.getAttribute('data-delay') || '0');
          if (entry.isIntersecting) {
            el.style.animationDelay = `${delay}s`;
            el.classList.add('is-visible');
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.9) {
            el.classList.remove('is-visible');
            el.style.animationDelay = '';
          }
        });
      },
      { threshold: 0.15 }
    );

    footerItems.forEach((el) => obs.observe(el));
  }

  setupFooterReveal();

  // ─────────────────────────────────────────────────────────────────────────
  // 5. TRANSIÇÃO ENTRE PÁGINAS (Home, Sabores, Lojas)
  // ─────────────────────────────────────────────────────────────────────────
  function clearActiveNav() {
    document.querySelectorAll('.nav-item').forEach((i) => i.classList.remove('active-nav'));
  }

  function showPage(pageEl, activeNavEl, scrollTargetId = null) {
    if (!pageEl || isTransitioning) return;

    const currentPage = document.querySelector('.page-view.active-page');
    clearActiveNav();
    if (activeNavEl) activeNavEl.classList.add('active-nav');

    if (currentPage === pageEl && !scrollTargetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      replayHeroAnimations(pageEl);
      return;
    }

    const doSwitch = () => {
      allPages.forEach((p) => {
        p.classList.remove('active-page');
        p.style.opacity = '';
        p.style.transform = '';
      });

      resetScrollReveal(pageEl);
      pageEl.classList.add('active-page');

      if (scrollTargetId) {
        setTimeout(() => {
          const t = document.getElementById(scrollTargetId);
          if (t) t.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo(0, 0);
      }

      replayHeroAnimations(pageEl);
      setTimeout(() => attachObserver(pageEl), 60);
      isTransitioning = false;
    };

    if (currentPage && currentPage !== pageEl && canAnimate) {
      isTransitioning = true;
      Motion.animate(
        currentPage,
        { opacity: [1, 0], scale: [1, 0.96], y: [0, -18] },
        { duration: 0.2, ease: EASE_SMOOTH }
      ).then(() => {
        currentPage.style.opacity = '';
        currentPage.style.transform = '';
        doSwitch();
      });
    } else {
      doSwitch();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. VINCULAÇÃO DOS BOTÕES DE NAVEGAÇÃO
  // ─────────────────────────────────────────────────────────────────────────
  [btnVerSaboresHero, btnExplorarSaboresSobre, footerSaboresLink].forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(saboresPage, navSaboresBtn);
      });
    }
  });
  if (navSaboresBtn) {
    navSaboresBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(saboresPage, navSaboresBtn);
    });
  }

  if (footerLojasLink) {
    footerLojasLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(lojasPage, navLojasBtn);
    });
  }
  if (navLojasBtn) {
    navLojasBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(lojasPage, navLojasBtn);
    });
  }

  [btnVoltarHome, logoHomeBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(homePage, null);
      });
    }
  });
  if (footerSobreLink) {
    footerSobreLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(homePage, navSobreBtn, 'sobre');
    });
  }
  if (navSobreBtn) {
    navSobreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(homePage, navSobreBtn, 'sobre');
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. HOVER & CLIQUE ELÁSTICO NOS TÍTULOS, SORVETES, VAN E CARDS
  // ─────────────────────────────────────────────────────────────────────────
  if (canAnimate) {
    // Títulos gráficos: title-home, title-sabores, title-lojas
    document.querySelectorAll('.hero-title-graphic').forEach((titleImg) => {
      titleImg.addEventListener('mouseenter', () => {
        Motion.animate(
          titleImg,
          { scale: 1.08, y: -6, rotate: -2 },
          { duration: 0.35, ease: EASE_SPRING }
        );
      });
      titleImg.addEventListener('mouseleave', () => {
        Motion.animate(
          titleImg,
          { scale: 1, y: 0, rotate: 0 },
          { duration: 0.45, ease: EASE_SPRING }
        ).then(() => {
          titleImg.style.transform = '';
        });
      });
      titleImg.addEventListener('click', () => {
        Motion.animate(
          titleImg,
          { scaleX: [1, 1.16, 0.9, 1.05, 1], scaleY: [1, 0.84, 1.12, 0.96, 1] },
          { duration: 0.55, ease: EASE_SPRING }
        ).then(() => {
          titleImg.style.transform = '';
        });
      });
    });

    // Sorvetes: casquinha-element e icecream-bowl-tight
    document.querySelectorAll('.icecream-container').forEach((container) => {
      const img = container.querySelector('.icecream-img');
      if (!img) return;

      container.addEventListener('mouseenter', () => {
        Motion.animate(
          img,
          { scale: 1.09, y: -12, rotate: 3.5 },
          { duration: 0.38, ease: EASE_SPRING }
        );
      });
      container.addEventListener('mouseleave', () => {
        Motion.animate(
          img,
          { scale: 1, y: 0, rotate: 0 },
          { duration: 0.48, ease: EASE_SPRING }
        ).then(() => {
          img.style.transform = '';
        });
      });
    });

    // Cards de Sabores Clássicos
    document.querySelectorAll('.flavor-item-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        Motion.animate(card, { y: -12, scale: 1.07 }, { duration: 0.35, ease: EASE_SPRING });
      });
      card.addEventListener('mouseleave', () => {
        Motion.animate(card, { y: 0, scale: 1 }, { duration: 0.42, ease: EASE_SPRING }).then(() => {
          card.style.transform = '';
        });
      });
    });

    // Botões Primários e Pílulas
    document
      .querySelectorAll(
        '.btn-primary, .btn-ver-rota, .btn-explorar-sabores, .btn-ifood-action, .btn-voltar-home'
      )
      .forEach((btn) => {
        btn.addEventListener('mouseenter', () => {
          Motion.animate(btn, { scale: 1.06, y: -3 }, { duration: 0.28, ease: EASE_SPRING });
        });
        btn.addEventListener('mouseleave', () => {
          Motion.animate(btn, { scale: 1, y: 0 }, { duration: 0.38, ease: EASE_SPRING }).then(
            () => {
              btn.style.transform = '';
            }
          );
        });
        btn.addEventListener('mousedown', () => {
          Motion.animate(btn, { scale: 0.94, y: 2 }, { duration: 0.1, ease: EASE_SMOOTH });
        });
        btn.addEventListener('mouseup', () => {
          Motion.animate(btn, { scale: 1.06, y: -3 }, { duration: 0.2, ease: EASE_SPRING });
        });
      });

    // Pilares de Qualidade
    document.querySelectorAll('.pillar-item').forEach((p) => {
      p.addEventListener('mouseenter', () => {
        Motion.animate(p, { y: -8, scale: 1.1 }, { duration: 0.32, ease: EASE_SPRING });
        const svg = p.querySelector('.pillar-svg');
        if (svg) {
          Motion.animate(svg, { rotate: [0, -14, 12, 0] }, { duration: 0.5, ease: EASE_SPRING });
        }
      });
      p.addEventListener('mouseleave', () => {
        Motion.animate(p, { y: 0, scale: 1 }, { duration: 0.4, ease: EASE_SPRING }).then(() => {
          p.style.transform = '';
        });
      });
    });

    // Store Cards
    document.querySelectorAll('.store-item-card').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        Motion.animate(card, { y: -6, scale: 1.02 }, { duration: 0.3, ease: EASE_SPRING });
      });
      card.addEventListener('mouseleave', () => {
        Motion.animate(card, { y: 0, scale: 1 }, { duration: 0.4, ease: EASE_SPRING }).then(() => {
          card.style.transform = '';
        });
      });
    });

    // Botões Vermelhos do Topo (SABORES, LOJAS, SOBRE NÓS)
    document.querySelectorAll('.nav-pill').forEach((pill) => {
      pill.addEventListener('mouseenter', () => {
        Motion.animate(pill, { scale: 1.12, y: -3 }, { duration: 0.28, ease: EASE_SPRING });
      });
      pill.addEventListener('mouseleave', () => {
        Motion.animate(pill, { scale: 1, y: 0 }, { duration: 0.35, ease: EASE_SPRING }).then(() => {
          pill.style.transform = '';
        });
      });
    });

    // Botões Sociais Amarelos
    document.querySelectorAll('.jundia-social-btn').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        Motion.animate(btn, { scale: 1.22, rotate: 10 }, { duration: 0.3, ease: EASE_SPRING });
      });
      btn.addEventListener('mouseleave', () => {
        Motion.animate(btn, { scale: 1, rotate: 0 }, { duration: 0.4, ease: EASE_SPRING }).then(
          () => {
            btn.style.transform = '';
          }
        );
      });
    });

    // Logo
    const logoEl = document.querySelector('.brand-logo');
    if (logoEl) {
      logoEl.addEventListener('mouseenter', () => {
        Motion.animate(logoEl, { scale: 1.1, rotate: -4 }, { duration: 0.35, ease: EASE_SPRING });
      });
      logoEl.addEventListener('mouseleave', () => {
        Motion.animate(logoEl, { scale: 1, rotate: 0 }, { duration: 0.45, ease: EASE_SPRING }).then(
          () => {
            logoEl.style.transform = '';
          }
        );
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. JELLY BOUNCE NO CLIQUE DOS SORVETES E VAN JUNDIÁ
  // ─────────────────────────────────────────────────────────────────────────
  function setupTactileClick(sel) {
    document.querySelectorAll(sel).forEach((el) => {
      el.addEventListener('click', () => {
        if (!canAnimate) return;
        const target = el.querySelector('img') || el;
        Motion.animate(
          target,
          { scaleX: [1, 1.22, 0.86, 1.08, 1], scaleY: [1, 0.78, 1.16, 0.94, 1] },
          { duration: 0.6, ease: EASE_SPRING }
        ).then(() => {
          target.style.transform = '';
        });
      });
    });
  }

  setupTactileClick('#icecreamHero');
  setupTactileClick('#icecreamBowlHero');
  setupTactileClick('#icecreamLojasHero');
  setupTactileClick('#truckShowcase');

  // ─────────────────────────────────────────────────────────────────────────
  // 9. FILTROS DE LOJAS
  // ─────────────────────────────────────────────────────────────────────────
  const filterPills  = document.querySelectorAll('.filter-pill');
  const storeCardEls = document.querySelectorAll('.store-item-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      if (canAnimate) {
        Motion.animate(
          pill,
          { scale: [0.88, 1.16, 0.97, 1] },
          { duration: 0.42, ease: EASE_SPRING }
        );
      }

      const filter  = pill.getAttribute('data-filter');
      const visible = [];

      storeCardEls.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'todas' || cat === filter) {
          card.style.display = 'flex';
          visible.push(card);
        } else {
          card.style.display = 'none';
        }
      });

      if (canAnimate && visible.length) {
        Motion.animate(
          visible,
          { scale: [0.85, 1.04, 1], y: [24, 0], opacity: [0, 1] },
          { delay: Motion.stagger(0.08), duration: 0.5, ease: EASE_SPRING }
        ).then(() => {
          visible.forEach((c) => {
            c.style.transform = '';
            c.style.opacity = '1';
          });
        });
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 10. BUSCA DE LOCALIZAÇÃO
  // ─────────────────────────────────────────────────────────────────────────
  const cepInput  = document.getElementById('cepSearchInput');
  const cepSubmit = document.querySelector('.lojas-search-submit');
  if (cepInput && cepSubmit) {
    const scrollToMap = () => {
      const s = document.querySelector('.lojas-section-header');
      if (s) s.scrollIntoView({ behavior: 'smooth' });
    };
    cepSubmit.addEventListener('click', scrollToMap);
    cepInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') scrollToMap();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 11. HEADER AO SCROLL
  // ─────────────────────────────────────────────────────────────────────────
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 40) siteHeader.classList.add('scrolled');
        else siteHeader.classList.remove('scrolled');
      },
      { passive: true }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 12. EFEITO RIPPLE NOS BOTÕES
  // ─────────────────────────────────────────────────────────────────────────
  document.querySelectorAll('.ripple-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const circle   = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius   = diameter / 2;
      const rect     = this.getBoundingClientRect();
      circle.style.cssText =
        `width:${diameter}px;height:${diameter}px;` +
        `left:${e.clientX - rect.left - radius}px;` +
        `top:${e.clientY - rect.top - radius}px;`;
      circle.classList.add('ripple');
      const old = this.querySelector('.ripple');
      if (old) old.remove();
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 13. MENU MOBILE
  // ─────────────────────────────────────────────────────────────────────────
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks  = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-item').forEach((item) => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 14. PARTÍCULAS AMARELAS DECORATIVAS NO FUNDO BRANCO
  // ─────────────────────────────────────────────────────────────────────────
  if (canAnimate) {
    document.querySelectorAll('.white-page').forEach((section) => {
      for (let i = 0; i < 6; i++) {
        const dot  = document.createElement('div');
        const size = 8 + Math.random() * 12;
        Object.assign(dot.style, {
          position:      'absolute',
          width:         `${size}px`,
          height:        `${size}px`,
          borderRadius:  '50%',
          background:    `rgba(255, 204, 0, ${0.16 + Math.random() * 0.2})`,
          left:          `${8 + Math.random() * 84}%`,
          top:           `${8 + Math.random() * 80}%`,
          pointerEvents: 'none',
          zIndex:        '1'
        });
        section.appendChild(dot);
        const yD  = (Math.random() - 0.5) * 80;
        const xD  = (Math.random() - 0.5) * 55;
        const dur = 4.5 + Math.random() * 5;
        Motion.animate(
          dot,
          { y: [0, yD, 0], x: [0, xD, 0], scale: [0.4, 1.2, 0.6, 1.1, 0.4] },
          { duration: dur, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }
        );
      }
    });

    // Floating dock pop de entrada
    document.querySelectorAll('.floating-btn').forEach((btn, i) => {
      btn.style.opacity = '0';
      Motion.animate(
        btn,
        { scale: [0, 1.25, 0.94, 1], opacity: [0, 1] },
        { duration: 0.65, delay: 0.5 + i * 0.12, ease: EASE_SPRING }
      ).then(() => {
        btn.style.opacity = '1';
        btn.style.transform = '';
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 15. DISPARO INICIAL IMEDIATO
  // ─────────────────────────────────────────────────────────────────────────
  requestAnimationFrame(() => {
    replayHeroAnimations(homePage);
    attachObserver(homePage);
  });
});
