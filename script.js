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

document.querySelectorAll('.animate-on-scroll, .animate-from-left, .animate-from-right, .animate-scale').forEach(el => {
    window._portfolioObserver.observe(el);
});

// Animation failsafe — reveal all animated elements after 2s
// in case IntersectionObserver doesn't fire (e.g. slow load, edge cases)
setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll:not(.visible), .animate-from-left:not(.visible), .animate-from-right:not(.visible), .animate-scale:not(.visible)').forEach(el => {
        el.classList.add('visible');
    });
}, 2000);
