document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    let lastScrollTop = 0;
    
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        ripple.className = 'ripple';
        
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    // Mobile menu toggle with animation
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            createRipple(e);
            sidebar.classList.toggle('active');
            mainContent.classList.toggle('nav-active');
            menuToggle.classList.toggle('active');
            
            // Add overlay when menu is open
            if (sidebar.classList.contains('active')) {
                const overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('active');
                    mainContent.classList.remove('nav-active');
                    menuToggle.classList.remove('active');
                    overlay.remove();
                });
            } else {
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.remove();
            }
        });
    }

    // Handle scroll for sticky header
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const mobileHeader = document.querySelector('.mobile-header');
        
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling down & past 100px
            mobileHeader.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up or at top
            mobileHeader.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnMenuToggle = menuToggle.contains(e.target);
            
            if (!isClickInsideSidebar && !isClickOnMenuToggle && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('nav-active');
                menuToggle.classList.remove('active');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.remove();
            }
        }
    });

    // Enhanced nav links interaction
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const icon = link.querySelector('i');
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            link.style.paddingLeft = '25px';
        });
        
        link.addEventListener('mouseleave', () => {
            const icon = link.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
            link.style.paddingLeft = '15px';
        });
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add sliding effect
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                // Smooth scroll with enhanced easing
                window.scrollTo({
                    top: target.offsetTop - 70, // Account for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu with animation
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    mainContent.classList.remove('nav-active');
                    menuToggle.classList.remove('active');
                    const overlay = document.querySelector('.sidebar-overlay');
                    if (overlay) overlay.remove();
                }
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                mainContent.classList.remove('nav-active');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.remove();
            }
        }, 250);
    });
});

// Image Slider Functions
let slideIndex = 0;
let slideInterval;

// This function will run once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the slider after DOM content is loaded
    initializeSlider();
});

function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    
    // If no slides are found, don't proceed
    if (slides.length === 0) return;
    
    // Set up automatic sliding
    startAutoSlide();
    
    // Pause auto sliding when user interacts with controls
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
        
        // For touch devices
        sliderContainer.addEventListener('touchstart', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('touchend', () => {
            startAutoSlide();
        });
    }
    
    // Show the first slide
    showSlide(slideIndex);
}

function startAutoSlide() {
    // Clear any existing interval
    clearInterval(slideInterval);
    
    // Set new interval for automatic sliding - every 5 seconds
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(n) {
    showSlide(slideIndex += n);
}

function jumpToSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    // Handle index boundaries (loop back to beginning/end)
    if (n >= slides.length) {
        slideIndex = 0;
    }
    
    if (n < 0) {
        slideIndex = slides.length - 1;
    }
    
    // Move the slider to show the current slide
    const imageSlider = document.querySelector('.image-slider');
    if (imageSlider) {
        imageSlider.style.transform = `translateX(-${slideIndex * 20}%)`;
    }
    
    // Update the dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === slideIndex) {
                dot.classList.add('active');
            }
        });
    }
}
