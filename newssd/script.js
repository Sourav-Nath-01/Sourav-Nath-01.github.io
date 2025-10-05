document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Live Clock Functionality ---
    const clockElement = document.getElementById('live-clock');

    function updateClock() {
        const now = new Date();
        const options = {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        clockElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Update the clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);

    // --- 2. Theme Toggler ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.body.setAttribute('data-theme', currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        let newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- 3. Smooth Scrolling & Scroll-Spy ---
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('main section');

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if(targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll-spy using Intersection Observer for better performance
    const observerOptions = {
        root: null,
        rootMargin: '-70px 0px -50% 0px', // Adjust margin to trigger highlighting correctly
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.main-nav a[href="#${id}"]`);

            if (entry.isIntersecting) {
                // Remove active class from all links first
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to the current one
                if(navLink) navLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});