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


const toggle = () => {
    const burger = document.querySelector('.burger');
    if (burger) {
        burger.classList.toggle('toggle');
    }
};


function redirectToPage() {
        window.location.href = "https://www.instagram.com/jokaligis"; 
}

// Existing code remains...
// Existing code remains...

// Add this updated function for gallery and video popup functionality
const setupGalleryPopup = () => {
    // Get all gallery items from both lifestyle photos, gym progress, and valorant clips
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create popup elements to be added to the body
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    popupOverlay.style.display = 'none';
    
    // Create container for media (image or video)
    const popupMediaContainer = document.createElement('div');
    popupMediaContainer.className = 'popup-media-container';
    
    // Create image element (will be used for photos)
    const popupImage = document.createElement('img');
    popupImage.className = 'popup-image';
    
    // Create video element (will be used for clips)
    const popupVideo = document.createElement('video');
    popupVideo.className = 'popup-video';
    popupVideo.controls = true;
    popupVideo.autoplay = true;
    
    const popupCaption = document.createElement('div');
    popupCaption.className = 'popup-caption';
    
    // Append elements to the container
    popupMediaContainer.appendChild(popupImage);
    popupMediaContainer.appendChild(popupVideo);
    
    // Append container and caption to the overlay
    popupOverlay.appendChild(popupMediaContainer);
    popupOverlay.appendChild(popupCaption);
    document.body.appendChild(popupOverlay);
    
    // Add click event to each gallery item
    galleryItems.forEach(item => {
        // Get the section title to determine how to handle the click
        const sectionTitle = item.closest('.gallery-section').querySelector('h3').textContent;
        
        if (sectionTitle === 'Lifestyle Photos' || sectionTitle === 'GYM Progress') {
            // Handle image popup for lifestyle and gym progress
            item.style.cursor = 'pointer';
            
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.querySelector('.gallery-caption');
                
                // Hide the video, show the image
                popupVideo.style.display = 'none';
                popupImage.style.display = 'block';
                
                // Set the popup image source and caption
                popupImage.src = img.src;
                popupCaption.textContent = caption.textContent;
                
                // Show the popup
                popupOverlay.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
            });
        } 
        else if (sectionTitle === 'My Valorant Clips') {
            // Handle video popup for Valorant clips
            item.style.cursor = 'pointer';
            
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                
                const caption = item.querySelector('.gallery-caption');
                const clipNumber = caption.textContent.trim().toLowerCase();
                
                // Hide the image, show the video
                popupImage.style.display = 'none';
                popupVideo.style.display = 'block';
                
                // Determine which video to show based on the caption
                let videoSrc = '';
                if (clipNumber === 'ace 01') {
                    videoSrc = 'videos/clip1.mp4';
                } else if (clipNumber === 'ace 02') {
                    videoSrc = 'videos/clip2.mp4';
                } else if (clipNumber === 'ace 03') {
                    videoSrc = 'videos/clip3.mp4';
                }
                
                // Set video source and load it
                popupVideo.src = videoSrc;
                popupVideo.load();
                
                // Set caption
                popupCaption.textContent = caption.textContent;
                
                // Show the popup
                popupOverlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                return false; // Stop event propagation
            });
        }
    });
    
    // Close popup when clicking outside the media
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
            
            // Pause video if it's playing
            if (popupVideo.src) {
                popupVideo.pause();
            }
        }
    });
};

// Update DOMContentLoaded event to include our new function
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    scrollReveal();
    smoothScroll();
    activeNavHighlight();
    setupGalleryPopup(); // Add this line
});

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
    
    // Add "WITA" timezone label next to the time
    const timeText = now.toLocaleTimeString('id-ID', timeOptions);
    document.getElementById('time').textContent = timeText + " WITA";
}

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime();