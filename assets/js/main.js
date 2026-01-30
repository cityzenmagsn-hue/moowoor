// Main JavaScript - Navigation et interactions principales

// Hamburger Menu
class HamburgerMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.hamburger.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.close();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        this.updateUI();
    }
    
    close() {
        this.isOpen = false;
        this.updateUI();
    }
    
    updateUI() {
        this.hamburger.classList.toggle('active', this.isOpen);
        this.navMenu.classList.toggle('active', this.isOpen);
        document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
}

// Smooth Scrolling
class SmoothScrolling {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 80; // Account for fixed nav
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Active Navigation Highlight
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.updateActiveLink());
        this.updateActiveLink(); // Initial call
    }
    
    updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = '';
        this.sections.forEach(section => {
            if (section.offsetTop <= scrollPosition && 
                section.offsetTop + section.offsetHeight > scrollPosition) {
                currentSection = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Form Handling
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Basic validation
        if (!this.validateForm(form)) {
            return;
        }
        
        // Show loading state
        this.showLoading(form);
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccess(form);
            form.reset();
        }, 2000);
    }
    
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showError(field, 'Ce champ est requis');
                isValid = false;
            } else {
                this.clearError(field);
            }
        });
        
        return isValid;
    }
    
    showError(field, message) {
        field.classList.add('error');
        const errorElement = field.parentNode.querySelector('.error-message') || 
                           document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!field.parentNode.querySelector('.error-message')) {
            field.parentNode.appendChild(errorElement);
        }
    }
    
    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Envoi...';
        }
    }
    
    showSuccess(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Envoyé ✓';
            submitBtn.classList.add('success');
            
            setTimeout(() => {
                submitBtn.innerHTML = 'Envoyer';
                submitBtn.classList.remove('success');
            }, 3000);
        }
        
        // Show success message
        this.showNotification('Message envoyé avec succès !', 'success');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Search Functionality
class SearchFunctionality {
    constructor() {
        this.searchInput = document.getElementById('search');
        this.searchResults = document.getElementById('searchResults');
        this.data = [];
        this.init();
    }
    
    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
            this.searchInput.addEventListener('focus', () => this.showResults());
            document.addEventListener('click', (e) => this.handleOutsideClick(e));
        }
    }
    
    async loadData() {
        try {
            const response = await fetch('/data/search.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }
    
    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            this.hideResults();
            return;
        }
        
        const results = this.data.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
        
        this.displayResults(results);
    }
    
    displayResults(results) {
        if (!this.searchResults) return;
        
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-result-item">
                    <p>Aucun résultat trouvé</p>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-category">${result.category}</div>
                    <div class="search-result-description">${result.description}</div>
                </a>
            `).join('');
        }
        
        this.showResults();
    }
    
    showResults() {
        if (this.searchResults && this.searchInput.value.length >= 2) {
            this.searchResults.classList.add('show');
        }
    }
    
    hideResults() {
        if (this.searchResults) {
            this.searchResults.classList.remove('show');
        }
    }
    
    handleOutsideClick(e) {
        if (!e.target.closest('.search-container')) {
            this.hideResults();
        }
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static animateNumber(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    new HamburgerMenu();
    new SmoothScrolling();
    new ActiveNavigation();
    new FormHandler();
    new SearchFunctionality();
    
    // Animate stats numbers
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.target);
                    Utils.animateNumber(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
    
    // Add smooth reveal animations
    const animateElements = document.querySelectorAll('.scroll-animate');
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        animateObserver.observe(element);
    });
});

// Export for use in other modules
window.MoowoorUI = {
    HamburgerMenu,
    SmoothScrolling,
    ActiveNavigation,
    FormHandler,
    SearchFunctionality,
    Utils
};