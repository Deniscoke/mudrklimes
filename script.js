/* ===========================================
   MUDr. Drahomír Klimeš – Dental Practice
   script.js
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSwiper();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initScrollReveal();
});

/* --- Hero Slider --- */
function initSwiper() {
    const progressBar = document.getElementById('hero-progress');
    const currentEl = document.getElementById('slide-current');
    const AUTOPLAY_DELAY = 6000;

    function startProgress() {
        if (!progressBar) return;
        progressBar.classList.remove('animating');
        // Force reflow so the animation restarts
        void progressBar.offsetHeight;
        progressBar.classList.add('animating');
    }

    function updateCounter(swiper) {
        if (!currentEl) return;
        const idx = swiper.realIndex + 1;
        currentEl.textContent = idx < 10 ? '0' + idx : idx;
    }

    const swiper = new Swiper('.hero-slider', {
        loop: true,
        speed: 1000,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: {
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.hero-bar__arrow--next',
            prevEl: '.hero-bar__arrow--prev',
        },
        on: {
            init(swiper) {
                updateCounter(swiper);
                startProgress();
            },
            slideChange(swiper) {
                updateCounter(swiper);
                startProgress();
            },
        },
    });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobile-menu');
    if (!burger || !menu) return;

    function toggleMenu() {
        const isOpen = burger.classList.toggle('open');
        menu.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
        menu.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    burger.addEventListener('click', toggleMenu);

    // Close on link click
    menu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('open')) toggleMenu();
        });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menu.classList.contains('open')) toggleMenu();
    });
}

/* --- Header scroll effect --- */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const hero = document.getElementById('hero');
    const threshold = hero ? hero.offsetHeight - 100 : 200;

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > threshold);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
}

/* --- Smooth scroll for anchor links --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            e.preventDefault();
            const headerH = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--header-h')) || 80;

            window.scrollTo({
                top: target.offsetTop - headerH,
                behavior: 'smooth',
            });
        });
    });
}

/* --- Scroll Reveal (Intersection Observer) --- */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => observer.observe(el));
}
