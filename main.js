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

    // ── 0. THEME TOGGLER (LIGHT/DARK MODE) ──────────────────────────────────
    const themeBtn = document.getElementById('theme-toggle');
    const getTheme = () => localStorage.getItem('theme') || 'dark';
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    
    // Apply theme on load
    setTheme(getTheme());
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const nextTheme = getTheme() === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    }

    // ── 1. HEADER SCROLL ────────────────────────────────────────────────────
    const header = document.getElementById('header');
    const onScroll = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 40);
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
            const contactSel  = document.getElementById('form-contact').value;
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

            const text = `Olá! Acessei o site da Alexandre Vans e gostaria de solicitar um orçamento. Seguem os dados do meu pedido:

• *Nome:* ${name}
• *Contato:* ${phone}
• *Serviço:* ${labels[service] || service}
• *Origem:* ${origin}
• *Destino:* ${destination}
• *Data:* ${dateFormatted}
• *Passageiros:* ${passengers}

*Observações:* ${message}

Poderiam me ajudar com a cotação? Obrigado!`;

            // Contact routing
            let targetPhone = '';
            if (contactSel === 'mineiro') {
                targetPhone = '5511984451740';
            } else if (contactSel === 'donizete') {
                targetPhone = '5511971391639';
            } else {
                // Random distribution (50/50 balance)
                targetPhone = Math.random() < 0.5 ? '5511984451740' : '5511971391639';
            }

            const url = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(text)}`;
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

    // ── 11. WHATSAPP DROPDOWN & FLOATING MENU TOGGLES ────────────────────────
    const dropdownToggle = document.getElementById('whatsapp-dropdown-toggle');
    const dropdownMenu   = document.getElementById('whatsapp-dropdown');
    
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });
    }
    
    const fabBtn  = document.getElementById('fab-whatsapp-btn');
    const fabMenu = document.getElementById('fab-menu');
    
    if (fabBtn && fabMenu) {
        fabBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = fabMenu.classList.contains('open');
            fabMenu.classList.toggle('open');
            fabBtn.setAttribute('aria-expanded', !isOpen);
        });
        
        // Close FAB menu when clicking outside
        document.addEventListener('click', () => {
            if (fabMenu) fabMenu.classList.remove('open');
            if (fabBtn) fabBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // ── 12. 4-SECOND CONTACT POPUP ───────────────────────────────────────────
    const popup = document.getElementById('contact-popup');
    const popupClose = document.getElementById('popup-close');
    const popupOverlay = document.getElementById('popup-overlay');
    
    if (popup && popupClose && popupOverlay) {
        // Show popup after 4 seconds
        setTimeout(() => {
            // Only show if the user hasn't closed it in this session
            if (!sessionStorage.getItem('popup_closed')) {
                popup.classList.add('visible');
                popup.setAttribute('aria-hidden', 'false');
            }
        }, 4000);
        
        const closePopup = () => {
            popup.classList.remove('visible');
            popup.setAttribute('aria-hidden', 'true');
            sessionStorage.setItem('popup_closed', 'true');
        };
        
        popupClose.addEventListener('click', closePopup);
        popupOverlay.addEventListener('click', closePopup);
    }

});
