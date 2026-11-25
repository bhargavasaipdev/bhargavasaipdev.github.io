(function () {
    'use strict';

    const navbar = document.querySelector('.site-navbar');
    const heroShell = document.querySelector('.hero-shell');
    const progressBar = document.querySelector('.scroll-progress');
    const backToTop = document.getElementById('backToTop');
    const bannerToggle = document.getElementById('bannerToggleBtn');
    const bannerToggleLabel = document.getElementById('bannerToggleLabel');
    let userToggledBanner = false;
    let isAutoCollapsed = false;

    function updateScrollUI() {
        const scrollY = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;

        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        if (navbar) {
            navbar.classList.toggle('is-scrolled', scrollY > 40);
        }

        if (heroShell) {
            heroShell.classList.toggle('is-scroll-compressed', scrollY > 60);
            if (!userToggledBanner && heroShell.dataset.autoCollapse === 'true') {
                if (!isAutoCollapsed && scrollY > 240) {
                    isAutoCollapsed = true;
                } else if (isAutoCollapsed && scrollY < 24) {
                    isAutoCollapsed = false;
                }
                heroShell.classList.toggle('is-banner-collapsed', isAutoCollapsed);
                if (bannerToggle) {
                    bannerToggle.setAttribute('aria-expanded', String(!isAutoCollapsed));
                }
                if (bannerToggleLabel) {
                    bannerToggleLabel.textContent = isAutoCollapsed ? 'Show Banner' : 'Collapse Banner';
                }
            }
        }

        if (backToTop) {
            backToTop.classList.toggle('is-visible', scrollY > 280);
        }
    }

    if (bannerToggle && heroShell) {
        bannerToggle.addEventListener('click', function () {
            userToggledBanner = true;
            const collapsed = heroShell.classList.toggle('is-banner-collapsed');
            bannerToggle.setAttribute('aria-expanded', String(!collapsed));
            if (bannerToggleLabel) {
                bannerToggleLabel.textContent = collapsed ? 'Show Banner' : 'Collapse Banner';
            }
        });
    }

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll reveal animations
    const revealItems = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && revealItems.length) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealItems.forEach(function (el) {
            el.classList.add('is-revealed');
        });
    }

    // Scrollspy for policy TOC links
    const tocLinks = document.querySelectorAll('.toc-link[href^="#"]');
    const sections = Array.from(tocLinks)
        .map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        })
        .filter(Boolean);

    function updateActiveToc() {
        if (!sections.length) return;
        const offset = 130;
        let currentId = sections[0].id;
        for (let i = 0; i < sections.length; i++) {
            const rect = sections[i].getBoundingClientRect();
            if (rect.top <= offset) {
                currentId = sections[i].id;
            }
        }
        tocLinks.forEach(function (link) {
            const matches = link.getAttribute('href') === '#' + currentId;
            link.classList.toggle('is-active', matches);
        });
    }

    window.addEventListener('scroll', function () {
        updateScrollUI();
        updateActiveToc();
    }, { passive: true });

    updateScrollUI();
    updateActiveToc();
})();
