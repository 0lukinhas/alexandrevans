/**
 * Alexandre Vans — main.js
 * - Header scroll effect
 * - Mobile drawer menu (correct full-height implementation)
 * - Scroll spy
 * - Fleet tabs
 * - Service pre-selection from links
 * - WhatsApp form redirect
 * - Scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. HEADER SCROLL ────────────────────────────────────────────────────
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── 2. MOBILE DRAWER MENU ───────────────────────────────────────────────
    const menuBtn    = document.getElementById('menu-toggle');
    const drawer     = document.getElementById('mobile-drawer');
    const overlay    = document.getElementById('mobile-overlay');
    const closeBtn   = document.getElementById('drawer-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('visible');
        menuBtn.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('visible');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        isOpen ? closeDrawer() : openDrawer();
    });

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    // ── 3. SCROLL SPY (ACTIVE NAV LINK) ─────────────────────────────────────
    const allNavLinks = document.querySelectorAll('.nav-link');
    const scrollSections = document.querySelectorAll('section[id]');

    function updateSpy() {
        const scrollPos = window.scrollY + 100;
        let currentSection = '';

        scrollSections.forEach(sec => {
            if (sec.offsetTop <= scrollPos) {
                currentSection = sec.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
    }

    window.addEventListener('scroll', updateSpy, { passive: true });
    updateSpy();

    // ── 4. FLEET TABS ────────────────────────────────────────────────────────
    const tabBtns   = document.querySelectorAll('.tab-btn');
    const fleetPanels = document.querySelectorAll('.fleet-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;

            tabBtns.forEach(b => b.classList.remove('active'));
            fleetPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const panel = document.getElementById(`fleet-${target}`);
            if (panel) panel.classList.add('active');
        });
    });

    // ── 5. SERVICE PRE-SELECTION ─────────────────────────────────────────────
    const serviceSelect = document.getElementById('form-service');

    document.querySelectorAll('[data-service]').forEach(el => {
        el.addEventListener('click', () => {
            const val = el.dataset.service;
            if (serviceSelect && val) {
                serviceSelect.value = val;
                serviceSelect.dispatchEvent(new Event('change'));
            }
        });
    });

    document.querySelectorAll('[data-fill-service]').forEach(el => {
        el.addEventListener('click', () => {
            const val = el.dataset.fillService;
            if (serviceSelect && val) {
                serviceSelect.value = val;
                serviceSelect.dispatchEvent(new Event('change'));
            }
        });
    });

    // ── 6. WHATSAPP FORM BUILDER ─────────────────────────────────────────────
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', e => {
            e.preventDefault();

            const name        = document.getElementById('form-name').value.trim();
            const phone       = document.getElementById('form-phone').value.trim();
            const service     = document.getElementById('form-service').value;
            const origin      = document.getElementById('form-origin').value.trim() || '—';
            const destination = document.getElementById('form-destination').value.trim() || '—';
            const date        = document.getElementById('form-date').value;
            const passengers  = document.getElementById('form-passengers').value || '—';
            const message     = document.getElementById('form-message').value.trim() || '—';

            const labels = {
                Executivo: 'Transporte Executivo / Corporativo',
                Escolar:   'Transporte Escolar',
                Traslado:  'Transfer para Aeroporto',
                Turismo:   'Viagem / Turismo / Excursão',
                Eventos:   'Eventos / Casamentos',
                Outro:     'Outro'
            };

            let dateFormatted = '—';
            if (date) {
                const [y, m, d] = date.split('-');
                dateFormatted = `${d}/${m}/${y}`;
            }

            const text = `Olá, Alexandre Vans! 👋

*Solicitação de Orçamento*

• *Nome:* ${name}
• *Contato:* ${phone}
• *Serviço:* ${labels[service] || service}
• *Origem:* ${origin}
• *Destino:* ${destination}
• *Data:* ${dateFormatted}
• *Passageiros:* ${passengers}

*Observações:* ${message}

_(Mensagem enviada pelo site)_`;

            const url = `https://api.whatsapp.com/send?phone=5511997964466&text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        });
    }

    // ── 7. SCROLL REVEAL (INTERSECTION OBSERVER) ─────────────────────────────
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── 8. FAQ ACCORDION ─────────────────────────────────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn    = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('open');
                    other.querySelector('.faq-answer').style.maxHeight = null;
                    other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = null;
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ── 9. COOKIE / LGPD BANNER ──────────────────────────────────────────────
    const cookieBanner  = document.getElementById('cookie-banner');
    const cookieAccept  = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    const COOKIE_KEY = 'av_cookie_consent';

    function showCookieBanner() {
        cookieBanner.setAttribute('aria-hidden', 'false');
        setTimeout(() => cookieBanner.classList.add('visible'), 1200);
    }

    function hideCookieBanner() {
        cookieBanner.classList.remove('visible');
        cookieBanner.setAttribute('aria-hidden', 'true');
    }

    if (!localStorage.getItem(COOKIE_KEY)) {
        showCookieBanner();
    }

    cookieAccept.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        hideCookieBanner();
    });

    cookieDecline.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'declined');
        hideCookieBanner();
    });

    // ── 10. STATS COUNTER ANIMATION ──────────────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-num');

    function animateCounter(el) {
        const target = el.textContent;
        const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''));
        const suffix = target.replace(/[0-9.]/g, ''); // "+", "h", "%", etc.

        if (isNaN(numericPart)) return;

        const duration = 1600;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed  = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericPart);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

});
