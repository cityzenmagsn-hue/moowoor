// Animations JavaScript - Gestion des animations et particules

// Particle Background
class ParticleBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        if (!this.container) return;

        this.createParticles();
        this.animate();

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties
            const size = Math.random() * 4 + 2;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 10;
            const opacity = Math.random() * 0.3 + 0.1;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.opacity = opacity;

            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    animate() {
        this.particles.forEach((particle, index) => {
            // Add floating animation
            const floatAnimation = `
                @keyframes float-${index} {
                    0%, 100% {
                        transform: translateY(100vh) translateX(0px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: ${particle.style.opacity};
                    }
                    90% {
                        opacity: ${particle.style.opacity};
                    }
                    100% {
                        transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;

            // Inject keyframes
            const styleSheet = document.createElement('style');
            styleSheet.textContent = floatAnimation;
            document.head.appendChild(styleSheet);

            particle.style.animation = `float-${index} ${particle.style.animationDuration} linear infinite`;
            particle.style.animationDelay = particle.style.animationDelay;
        });
    }

    handleResize() {
        // Adjust particle count based on screen size
        const width = window.innerWidth;
        if (width < 768) {
            this.particleCount = 20;
        } else if (width < 1024) {
            this.particleCount = 35;
        } else {
            this.particleCount = 50;
        }

        // Recreate particles if needed
        if (this.particles.length !== this.particleCount) {
            this.clearParticles();
            this.createParticles();
            this.animate();
        }
    }

    clearParticles() {
        this.particles.forEach(particle => particle.remove());
        this.particles = [];
    }
}

// Scroll Animations Manager
class ScrollAnimationsManager {
    constructor() {
        this.elements = [];
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupObserver();
        this.observeElements();
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
    }

    observeElements() {
        // Find all elements with scroll animation classes
        const animatedElements = document.querySelectorAll([
            '.scroll-animate',
            '.animate-fade-in',
            '.animate-fade-in-up',
            '.animate-fade-in-left',
            '.animate-fade-in-right',
            '.animate-scale-in'
        ].join(','));

        animatedElements.forEach(element => {
            this.elements.push(element);
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        // Add visible class
        element.classList.add('visible');

        // Trigger specific animations based on classes
        if (element.classList.contains('animate-fade-in')) {
            element.style.animation = 'fadeIn 0.8s ease-out forwards';
        } else if (element.classList.contains('animate-fade-in-up')) {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        } else if (element.classList.contains('animate-fade-in-left')) {
            element.style.animation = 'fadeInLeft 0.8s ease-out forwards';
        } else if (element.classList.contains('animate-fade-in-right')) {
            element.style.animation = 'fadeInRight 0.8s ease-out forwards';
        } else if (element.classList.contains('animate-scale-in')) {
            element.style.animation = 'scaleIn 0.6s ease-out forwards';
        }

        // Add stagger animation for lists
        if (element.classList.contains('stagger-item')) {
            const parent = element.parentNode;
            const items = parent.querySelectorAll('.stagger-item');
            items.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
            });
        }
    }

    // Method to manually trigger animations
    triggerAnimation(element) {
        this.animateElement(element);
    }
}

// Micro-interactions
class MicroInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupButtonEffects();
        this.setupCardEffects();
        this.setupFormEffects();
        this.setupLinkEffects();
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            // Ripple effect
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });

            // Hover effect with scale
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }

    setupCardEffects() {
        const cards = document.querySelectorAll('.card, .module-card, .career-card');

        cards.forEach(card => {
            // Tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                this.handleCardTilt(e, card);
            });

            card.addEventListener('mouseleave', () => {
                this.resetCardTilt(card);
            });
        });
    }

    setupFormEffects() {
        const inputs = document.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Focus effect
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentNode.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentNode.classList.add('focused');
            }
        });
    }

    setupLinkEffects() {
        const links = document.querySelectorAll('a:not(.btn)');

        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateX(4px)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateX(0)';
            });
        });
    }

    createRipple(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleCardTilt(event, card) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }

    resetCardTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
}

// Loading States
class LoadingStates {
    constructor() {
        this.init();
    }

    init() {
        this.setupPageLoading();
        this.setupImageLoading();
        this.setupContentLoading();
    }

    setupPageLoading() {
        // Hide loader when page is ready
        window.addEventListener('load', () => {
            const loader = document.querySelector('.page-loader');
            if (loader) {
                setTimeout(() => {
                    loader.classList.add('hidden');
                }, 500);
            }
        });
    }

    setupImageLoading() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupContentLoading() {
        // Add loading states to dynamic content
        const loadingElements = document.querySelectorAll('[data-loading]');

        loadingElements.forEach(element => {
            const loadingType = element.dataset.loading;
            this.addLoadingState(element, loadingType);
        });
    }

    addLoadingState(element, type) {
        element.classList.add('loading');

        if (type === 'skeleton') {
            // Add skeleton loader
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-loader';
            element.appendChild(skeleton);
        } else if (type === 'spinner') {
            // Add spinner
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            element.appendChild(spinner);
        }
    }

    removeLoadingState(element) {
        element.classList.remove('loading');
        const loader = element.querySelector('.skeleton-loader, .loading-spinner');
        if (loader) {
            loader.remove();
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.measureInteractions();
        this.measureAnimations();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                total: navigation.loadEventEnd - navigation.fetchStart
            };

            console.log('Page Load Metrics:', this.metrics.pageLoad);
        });
    }

    measureInteractions() {
        // Measure click response time
        document.addEventListener('click', (e) => {
            const startTime = performance.now();

            requestAnimationFrame(() => {
                const endTime = performance.now();
                this.metrics.clickResponse = endTime - startTime;
            });
        });
    }

    measureAnimations() {
        // Measure frame rate
        let lastTime = performance.now();
        let frames = 0;

        const measureFPS = (currentTime) => {
            frames++;

            if (currentTime - lastTime >= 1000) {
                this.metrics.fps = frames;
                frames = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize all animation systems
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle background
    new ParticleBackground('particles');

    // Initialize scroll animations
    new ScrollAnimationsManager();

    // Initialize micro-interactions
    new MicroInteractions();

    // Initialize loading states
    new LoadingStates();

    // Initialize performance monitor
    new PerformanceMonitor();

    // Add CSS for ripple effect
    const rippleCSS = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .page-loader.hidden {
            opacity: 0;
            pointer-events: none;
        }
        
        .skeleton-loader {
            background: linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-card) 50%, var(--bg-hover) 75%);
            background-size: 200% 100%;
            animation: loading 1.5s ease-in-out infinite;
            border-radius: var(--border-radius);
        }
        
        .focused {
            border-color: var(--accent-primary) !important;
            box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = rippleCSS;
    document.head.appendChild(styleSheet);
});

// Export for use in other modules
window.MoowoorAnimations = {
    ParticleBackground,
    ScrollAnimationsManager,
    MicroInteractions,
    LoadingStates,
    PerformanceMonitor
};

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-animate');

    const elementInView = (el, offset = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Initial check
    handleScrollAnimation();
});