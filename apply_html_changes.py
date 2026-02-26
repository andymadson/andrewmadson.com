import os
import glob
import re

html_files = glob.glob('*.html')

toggle_html = '''<div class="nav-actions">
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Dark Mode">
                    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </button>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdHYfOCD4GqT7gGfpkM9jqjr7KVi7chFpqvv8XWhYHjovkC3w/viewform" target="_blank" rel="noopener" class="nav-cta">Work with Me</a>
            </div>'''

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'<a href="[^"]+" target="_blank" rel="noopener" class="nav-cta">Work with Me</a>'
    if 'class="nav-actions"' not in content:
        content = re.sub(pattern, toggle_html, content)

    if file == 'index.html':
        content = content.replace(
            '<div class="hero-text">', 
            '<div class="hero-text">\n                    <h1 class="visually-hidden" style="position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">Andrew Madson</h1>'
        )
    
    content = content.replace('class="social-proof-bar"', 'class="social-proof-bar reveal"')
    content = content.replace('class="logo-bar"', 'class="logo-bar reveal reveal-delay-1"')
    content = content.replace('class="carousel-section"', 'class="carousel-section reveal"')
    content = content.replace('class="fw-card ', 'class="fw-card reveal ')
    content = content.replace('class="about-grid"', 'class="about-grid reveal"')
    content = content.replace('class="timeline-item"', 'class="timeline-item reveal"')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML modifications complete.")
