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
}

// Active nav link highlighting
const currentPage = document.body.dataset.page;
if (currentPage && navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage + '.html' || (currentPage === 'home' && href === 'index.html')) {
            link.classList.add('nav-active');
        }
    });
}

// Scroll-triggered animations
window._portfolioObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    window._portfolioObserver.observe(el);
});
