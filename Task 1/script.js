// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const navItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    // Add scrolled class when scrolled
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Highlight active section in the navigation
    updateActiveSection();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Hover effect with color change
navItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        // Random gradient effect on hover (within our color scheme)
        const gradientAngle = Math.floor(Math.random() * 360);
        e.target.style.background = `linear-gradient(${gradientAngle}deg, var(--primary-color) 0%, var(--accent-color) 100%)`;
        e.target.style.color = 'white';
        e.target.style.boxShadow = 'var(--shadow)';
    });
    
    item.addEventListener('mouseleave', (e) => {
        // Reset styles when not hovered
        if (!e.target.classList.contains('active')) {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--text-color)';
            e.target.style.boxShadow = 'none';
        }
    });
});

// Update active section based on scroll position
function updateActiveSection() {
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navItems.forEach(item => {
                item.classList.remove('active');
                item.style.background = 'transparent';
                item.style.color = 'var(--text-color)';
                item.style.boxShadow = 'none';
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                
                // Add subtle gradient to active link
                activeLink.style.color = 'var(--primary-color)';
            }
        }
    });
}

// Initialize active section on page load
document.addEventListener('DOMContentLoaded', () => {
    updateActiveSection();
    
    // Add a small animation to the logo
    const logo = document.querySelector('.logo span');
    logo.style.opacity = '0';
    logo.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        logo.style.transition = 'all 0.8s ease';
        logo.style.opacity = '1';
        logo.style.transform = 'translateY(0)';
    }, 200);
    
    // Add animation to nav items
    navItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
}); 