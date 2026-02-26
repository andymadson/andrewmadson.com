// Nav background on scroll
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        document.body.classList.toggle('nav-open');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
        });
    });

    // Close mobile nav on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
        }
    });

    // Close mobile nav when clicking the backdrop overlay
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('nav-open') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navLinks.classList.remove('open');
            document.body.classList.remove('nav-open');
        }
    });
}

// Active nav link highlighting
const currentPage = document.body.dataset.page;
if (currentPage && navLinks) {
    const pageMap = {
        'home': 'index.html',
        'about-me': 'about-me.html',
        'books': 'books.html',
        'courses': 'books.html',
        'speaking': 'speaking.html',
        'podcast': 'podcast.html',
        'blog': 'blog.html',
        'newsletters': 'blog.html',
        'contact': 'contact.html',
    };
    const targetHref = pageMap[currentPage];
    if (targetHref) {
        navLinks.querySelectorAll('a').forEach(link => {
            if (link.getAttribute('href') === targetHref) {
                link.classList.add('nav-active');
            }
        });
    }
}

// ===== Theme Toggle =====
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        if (!currentTheme) {
            currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}