const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    if (burger) {
        burger.addEventListener('click', () => {

            nav.classList.toggle('nav-active');

            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            burger.classList.toggle('toggle');
        });
    }
};

const scrollReveal = () => {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const revealPoint = 150;
            
            if (sectionTop < window.innerHeight - revealPoint) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });
};

const smoothScroll = () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
};

const activeNavHighlight = () => {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    scrollReveal();
    smoothScroll();
    activeNavHighlight();
});

const toggle = () => {
    const burger = document.querySelector('.burger');
    if (burger) {
        burger.classList.toggle('toggle');
    }
};

function updateDateTime() {
    const now = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Makassar'
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false, 
        timeZone: 'Asia/Makassar'
    };

    document.getElementById('date').textContent = now.toLocaleDateString('id-ID', dateOptions);
    document.getElementById('time').textContent = now.toLocaleTimeString('id-ID', timeOptions);
}

// Perbarui setiap detik
setInterval(updateDateTime, 1000);
updateDateTime();

function redirectToPage() {
        window.location.href = "https://www.instagram.com/jokaligis"; 
}