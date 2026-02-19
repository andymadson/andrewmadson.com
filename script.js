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