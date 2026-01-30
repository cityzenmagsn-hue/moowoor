// Micro-interactions JavaScript - Enhanced user interactions

class MicroInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupMagneticCursor();
        this.setupScrollReveal();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupLoadingStates();
        this.setupProgressAnimations();
        this.setupInteractiveCards();
    }

    setupMagneticCursor() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 100;
                
                if (distance < maxDistance) {
                    const strength = (maxDistance - distance) / maxDistance;
                    const moveX = (x / maxDistance) * strength * 10;
                    const moveY = (y / maxDistance) * strength * 10;
                    
                    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupHoverEffects() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.addRippleEffect(button);
            });
        });

        // Card tilt effects
        const cards = document.querySelectorAll('.card, .module-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                this.addCardTilt(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    addRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addCardTilt(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    setupLoadingStates() {
        // Add skeleton loading for dynamic content
        const loadingContainers = document.querySelectorAll('[data-loading]');
        
        loadingContainers.forEach(container => {
            this.showSkeletonLoader(container);
            
            // Simulate content loading
            setTimeout(() => {
                this.hideSkeletonLoader(container);
            }, 1500);
        });
    }

    showSkeletonLoader(container) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton';
        skeleton.style.height = container.offsetHeight + 'px';
        skeleton.style.width = container.offsetWidth + 'px';
        
        container.style.position = 'relative';
        container.appendChild(skeleton);
    }

    hideSkeletonLoader(container) {
        const skeleton = container.querySelector('.skeleton');
        if (skeleton) {
            skeleton.style.opacity = '0';
            setTimeout(() => skeleton.remove(), 300);
        }
    }

    setupProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-enhanced');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target;
                    const targetWidth = progress.dataset.progress || '75%';
                    
                    setTimeout(() => {
                        progress.style.width = targetWidth;
                    }, 200);
                }
            });
        }, {
            threshold: 0.5
        });

        progressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1s ease-out';
            observer.observe(bar);
        });
    }

    setupInteractiveCards() {
        const cards = document.querySelectorAll('.interactive-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.addCardClickAnimation(card);
            });
            
            card.addEventListener('mouseenter', () => {
                this.addCardHoverEffect(card);
            });
        });
    }

    addCardClickAnimation(card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    addCardHoverEffect(card) {
        const icon = card.querySelector('.card-icon');
        if (icon) {
            icon.classList.add('icon-pulse');
            
            card.addEventListener('mouseleave', () => {
                icon.classList.remove('icon-pulse');
            }, { once: true });
        }
    }

    // Smooth scroll with easing
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const targetPosition = target.offsetTop - 80;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800;
                    
                    let start = null;
                    
                    const animation = (currentTime) => {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        }
                    };
                    
                    requestAnimationFrame(animation);
                }
            });
        });
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Sticky header with shadow animation
    setupStickyHeader() {
        const header = document.querySelector('header');
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .header-scrolled {
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1);
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const microInteractions = new MicroInteractions();
    
    // Add classes to elements for enhanced interactions
    document.querySelectorAll('.card, .module-card, .career-card').forEach(card => {
        card.classList.add('scroll-reveal', 'interactive-card');
    });
    
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('hover-lift');
    });
    
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
        heading.classList.add('scroll-reveal');
    });
    
    // Setup smooth scroll and sticky header
    microInteractions.setupSmoothScroll();
    microInteractions.setupStickyHeader();
});

// Export for use in other modules
window.MicroInteractions = MicroInteractions;