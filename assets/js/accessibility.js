// Accessibility JavaScript - Comprehensive accessibility features

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.setupAriaLiveRegions();
        this.setupAccessibilityControls();
        this.setupFormValidation();
        this.setupSkipLinks();
        this.setupTabNavigation();
        this.setupAccessibilityTesting();
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for all interactive elements
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        interactiveElements.forEach(element => {
            // Add keyboard event listeners
            element.addEventListener('keydown', (e) => {
                this.handleKeyboardNavigation(e, element);
            });
            
            // Ensure proper focus styles
            element.addEventListener('focus', () => {
                element.classList.add('keyboard-focused');
            });
            
            element.addEventListener('blur', () => {
                element.classList.remove('keyboard-focused');
            });
        });

        // Handle Escape key for modals and dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });
    }

    handleKeyboardNavigation(event, element) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                if (element.tagName === 'BUTTON' || element.role === 'button') {
                    event.preventDefault();
                    element.click();
                }
                break;
                
            case 'ArrowUp':
            case 'ArrowDown':
                if (element.getAttribute('role') === 'option' || element.classList.contains('menu-item')) {
                    event.preventDefault();
                    this.navigateMenuItems(element, event.key === 'ArrowDown' ? 1 : -1);
                }
                break;
                
            case 'Tab':
                // Handle tab trapping in modals
                if (element.closest('.modal[aria-hidden="false"]')) {
                    this.trapFocus(element.closest('.modal'));
                }
                break;
        }
    }

    navigateMenuItems(currentItem, direction) {
        const menuItems = Array.from(currentItem.parentElement.querySelectorAll('[role="option"], .menu-item'));
        const currentIndex = menuItems.indexOf(currentItem);
        let nextIndex = currentIndex + direction;
        
        if (nextIndex < 0) nextIndex = menuItems.length - 1;
        if (nextIndex >= menuItems.length) nextIndex = 0;
        
        menuItems[nextIndex].focus();
    }

    handleEscapeKey(event) {
        // Close modals
        const openModal = document.querySelector('.modal[aria-hidden="false"]');
        if (openModal) {
            this.closeModal(openModal);
            return;
        }
        
        // Close dropdowns
        const openDropdowns = document.querySelectorAll('.dropdown[aria-expanded="true"]');
        openDropdowns.forEach(dropdown => {
            this.closeDropdown(dropdown);
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels to elements that need them
        this.addAriaLabels();
        
        // Setup live regions for dynamic content
        this.setupLiveRegions();
        
        // Announce page changes
        this.announcePageChanges();
        
        // Setup landmark roles
        this.setupLandmarks();
    }

    addAriaLabels() {
        // Add labels to icon-only buttons
        document.querySelectorAll('button:has(> svg):not([aria-label])').forEach(button => {
            const icon = button.querySelector('svg');
            const iconName = this.getIconName(icon);
            if (iconName) {
                button.setAttribute('aria-label', iconName);
            }
        });
        
        // Add labels to navigation links
        document.querySelectorAll('.nav-link:not([aria-label])').forEach(link => {
            const text = link.textContent.trim();
            if (text) {
                link.setAttribute('aria-label', `Navigation: ${text}`);
            }
        });
        
        // Add descriptions to form inputs
        document.querySelectorAll('input, textarea, select').forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label && !input.getAttribute('aria-describedby')) {
                const helpText = input.parentElement.querySelector('.help-text, .error-message');
                if (helpText) {
                    input.setAttribute('aria-describedby', helpText.id || this.generateId(helpText));
                }
            }
        });
    }

    getIconName(svg) {
        // Simple icon name detection based on common patterns
        const paths = svg.querySelectorAll('path');
        const dValues = Array.from(paths).map(path => path.getAttribute('d')).join('');
        
        if (dValues.includes('M10 6') || dValues.includes('M3 12')) return 'Menu';
        if (dValues.includes('M19 6.41') || dValues.includes('M7 41')) return 'Close';
        if (dValues.includes('M21 21') || dValues.includes('M3 3')) return 'Search';
        if (dValues.includes('M12 2') || dValues.includes('M2 12')) return 'Home';
        if (dValues.includes('M20 6') || dValues.includes('M4 6')) return 'Download';
        if (dValues.includes('M9 11') || dValues.includes('M15 13')) return 'Arrow';
        
        return 'Icon';
    }

    setupLiveRegions() {
        // Create live regions for announcements
        const liveRegions = [
            { type: 'polite', id: 'status-live' },
            { type: 'assertive', id: 'error-live' },
            { type: 'polite', id: 'navigation-live' }
        ];
        
        liveRegions.forEach(region => {
            if (!document.getElementById(region.id)) {
                const liveRegion = document.createElement('div');
                liveRegion.id = region.id;
                liveRegion.setAttribute('aria-live', region.type);
                liveRegion.setAttribute('aria-atomic', 'true');
                liveRegion.className = 'sr-only';
                document.body.appendChild(liveRegion);
            }
        });
    }

    announcePageChanges() {
        // Announce when page content changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.target.classList.contains('main-content')) {
                    this.announceToScreenReader('Page content updated', 'polite');
                }
            });
        });
        
        const mainContent = document.querySelector('.main-content, main');
        if (mainContent) {
            observer.observe(mainContent, { childList: true, subtree: true });
        }
    }

    setupLandmarks() {
        // Add landmark roles if not present
        const landmarks = {
            'header': 'banner',
            'nav': 'navigation',
            'main': 'main',
            'aside': 'complementary',
            'footer': 'contentinfo'
        };
        
        Object.entries(landmarks).forEach((tag, role) => {
            document.querySelectorAll(tag).forEach(element => {
                if (!element.getAttribute('role')) {
                    element.setAttribute('role', role);
                }
            });
        });
    }

    setupFocusManagement() {
        // Manage focus for dynamic content
        this.setupModalFocus();
        this.setupTabFocus();
        this.setupSearchFocus();
        this.setupDropdownFocus();
    }

    setupModalFocus() {
        // Trap focus within modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('show', () => {
                this.trapFocus(modal);
            });
            
            modal.addEventListener('hide', () => {
                this.removeFocusTrap(modal);
            });
        });
    }

    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        // Focus first element
        firstElement.focus();
    }

    removeFocusTrap(container) {
        // Remove focus trap event listeners
        container.removeEventListener('keydown', this.trapFocusHandler);
    }

    setupTabFocus() {
        // Handle tab panel focus
        document.querySelectorAll('[role="tab"]').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab);
            });
            
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.switchTab(tab);
                }
            });
        });
    }

    switchTab(selectedTab) {
        const tablist = selectedTab.closest('[role="tablist"]');
        const tabs = tablist.querySelectorAll('[role="tab"]');
        const panels = tablist.parentElement.querySelectorAll('[role="tabpanel"]');
        
        // Update tab states
        tabs.forEach(tab => {
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
        });
        
        selectedTab.setAttribute('aria-selected', 'true');
        selectedTab.setAttribute('tabindex', '0');
        
        // Update panel visibility
        panels.forEach(panel => {
            panel.setAttribute('aria-hidden', 'true');
            panel.style.display = 'none';
        });
        
        const targetPanel = document.getElementById(selectedTab.getAttribute('aria-controls'));
        if (targetPanel) {
            targetPanel.setAttribute('aria-hidden', 'false');
            targetPanel.style.display = 'block';
            targetPanel.focus();
        }
    }

    setupSearchFocus() {
        // Handle search input focus
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                this.announceToScreenReader('Search activated. Type to search.', 'polite');
            });
        }
    }

    setupDropdownFocus() {
        // Handle dropdown focus
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            
            if (trigger) {
                trigger.addEventListener('click', () => {
                    const isOpen = dropdown.getAttribute('aria-expanded') === 'true';
                    dropdown.setAttribute('aria-expanded', !isOpen);
                    
                    if (!isOpen) {
                        this.trapFocus(dropdown);
                    } else {
                        this.removeFocusTrap(dropdown);
                    }
                });
            }
        });
    }

    setupAriaLiveRegions() {
        // Setup dynamic content announcements
        this.setupSearchAnnouncements();
        this.setupFormAnnouncements();
        this.setupNavigationAnnouncements();
    }

    setupSearchAnnouncements() {
        // Announce search results
        const searchContainer = document.getElementById('resultsContainer');
        if (searchContainer) {
            const observer = new MutationObserver(() => {
                const results = searchContainer.querySelectorAll('.search-result-item');
                const count = results.length;
                this.announceToScreenReader(`Found ${count} search results`, 'polite');
            });
            
            observer.observe(searchContainer, { childList: true });
        }
    }

    setupFormAnnouncements() {
        // Announce form validation errors
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const errors = form.querySelectorAll('.error-message');
                if (errors.length > 0) {
                    e.preventDefault();
                    this.announceToScreenReader(`Form has ${errors.length} error(s). Please review and correct.`, 'assertive');
                    errors[0].querySelector('input, textarea, select').focus();
                }
            });
        });
    }

    setupNavigationAnnouncements() {
        // Announce page navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const pageName = link.textContent.trim();
                this.announceToScreenReader(`Navigating to ${pageName}`, 'polite');
            });
        });
    }

    setupAccessibilityControls() {
        // Create accessibility controls panel
        this.createAccessibilityPanel();
        this.setupFontSizeControls();
        this.setupContrastControls();
        this.setupMotionControls();
    }

    createAccessibilityPanel() {
        // Create accessibility controls
        const panel = document.createElement('div');
        panel.id = 'accessibility-panel';
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <button class="accessibility-toggle" aria-label="Toggle accessibility options">
                <span aria-hidden="true">♿</span>
            </button>
            <div class="accessibility-controls" aria-hidden="true">
                <h3>Accessibility Options</h3>
                <div class="control-group">
                    <label for="font-size">Font Size</label>
                    <select id="font-size">
                        <option value="small">Small</option>
                        <option value="medium" selected>Medium</option>
                        <option value="large">Large</option>
                        <option value="extra-large">Extra Large</option>
                    </select>
                </div>
                <div class="control-group">
                    <label for="contrast">Contrast</label>
                    <select id="contrast">
                        <option value="normal" selected>Normal</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="control-group">
                    <label for="motion">Motion</label>
                    <select id="motion">
                        <option value="normal" selected>Normal</option>
                        <option value="reduced">Reduced</option>
                    </select>
                </div>
                <button class="btn btn-primary" id="accessibility-apply">Apply Changes</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Setup toggle
        const toggle = panel.querySelector('.accessibility-toggle');
        const controls = panel.querySelector('.accessibility-controls');
        
        toggle.addEventListener('click', () => {
            const isHidden = controls.getAttribute('aria-hidden') === 'true';
            controls.setAttribute('aria-hidden', !isHidden);
            toggle.setAttribute('aria-expanded', isHidden);
        });
        
        // Setup apply button
        const applyBtn = panel.querySelector('#accessibility-apply');
        applyBtn.addEventListener('click', () => {
            this.applyAccessibilitySettings();
        });
    }

    setupFontSizeControls() {
        const fontSizeSelect = document.getElementById('font-size');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                this.setFontSize(e.target.value);
            });
        }
    }

    setFontSize(size) {
        const sizes = {
            'small': '14px',
            'medium': '16px',
            'large': '18px',
            'extra-large': '20px'
        };
        
        document.documentElement.style.fontSize = sizes[size];
        localStorage.setItem('fontSize', size);
    }

    setupContrastControls() {
        const contrastSelect = document.getElementById('contrast');
        if (contrastSelect) {
            contrastSelect.addEventListener('change', (e) => {
                this.setContrast(e.target.value);
            });
        }
    }

    setContrast(level) {
        if (level === 'high') {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        localStorage.setItem('contrast', level);
    }

    setupMotionControls() {
        const motionSelect = document.getElementById('motion');
        if (motionSelect) {
            motionSelect.addEventListener('change', (e) => {
                this.setMotion(e.target.value);
            });
        }
    }

    setMotion(level) {
        if (level === 'reduced') {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
        
        localStorage.setItem('motion', level);
    }

    applyAccessibilitySettings() {
        const fontSize = document.getElementById('font-size').value;
        const contrast = document.getElementById('contrast').value;
        const motion = document.getElementById('motion').value;
        
        this.setFontSize(fontSize);
        this.setContrast(contrast);
        this.setMotion(motion);
        
        this.announceToScreenReader('Accessibility settings applied', 'polite');
        
        // Close panel
        const controls = document.querySelector('.accessibility-controls');
        controls.setAttribute('aria-hidden', 'true');
    }

    setupFormValidation() {
        // Enhanced form validation with accessibility
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.announceFormErrors(form);
                }
            });
            
            // Real-time validation
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
                
                field.addEventListener('input', () => {
                    this.clearFieldError(field);
                });
            });
        });
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;
        let isValid = true;
        let errorMessage = '';
        
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (value) {
            switch (type) {
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    errorMessage = 'Please enter a valid email address';
                    break;
                case 'tel':
                    isValid = /^[\d\s\-\+\(\)]+$/.test(value);
                    errorMessage = 'Please enter a valid phone number';
                    break;
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        field.setAttribute('aria-invalid', 'true');
        
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.id = this.generateId(field) + '-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.setAttribute('aria-describedby', errorElement.id);
    }

    clearFieldError(field) {
        field.removeAttribute('aria-invalid');
        
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        field.removeAttribute('aria-describedby');
    }

    announceFormErrors(form) {
        const errors = form.querySelectorAll('[aria-invalid="true"]');
        const count = errors.length;
        
        this.announceToScreenReader(
            `Form validation failed. ${count} error(s) found. Please review and correct.`,
            'assertive'
        );
        
        // Focus first error
        if (errors.length > 0) {
            errors[0].focus();
        }
    }

    setupSkipLinks() {
        // Add skip links for keyboard navigation
        const skipLinks = document.createElement('div');
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#search" class="skip-link">Skip to search</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    setupTabNavigation() {
        // Enhanced tab navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && e.shiftKey) {
                // Handle backward tab navigation
                this.handleBackwardTab(e);
            }
        });
    }

    handleBackwardTab(event) {
        // Custom logic for backward tab navigation
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (currentIndex === 0) {
            // Wrap around to last element
            event.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
        }
    }

    setupAccessibilityTesting() {
        // Add accessibility testing tools (development only)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.createAccessibilityTester();
        }
    }

    createAccessibilityTester() {
        const tester = document.createElement('div');
        tester.id = 'accessibility-tester';
        tester.innerHTML = `
            <button class="tester-toggle" aria-label="Toggle accessibility tester">
                <span aria-hidden="true">🔍</span>
            </button>
            <div class="tester-panel" aria-hidden="true">
                <h3>Accessibility Testing</h3>
                <button class="test-btn" data-test="contrast">Test Contrast</button>
                <button class="test-btn" data-test="focus">Test Focus Order</button>
                <button class="test-btn" data-test="labels">Test Labels</button>
                <button class="test-btn" data-test="headings">Test Headings</button>
            </div>
        `;
        
        document.body.appendChild(tester);
        
        // Setup tester functionality
        this.setupAccessibilityTesterControls(tester);
    }

    setupAccessibilityTesterControls(tester) {
        const toggle = tester.querySelector('.tester-toggle');
        const panel = tester.querySelector('.tester-panel');
        
        toggle.addEventListener('click', () => {
            const isHidden = panel.getAttribute('aria-hidden') === 'true';
            panel.setAttribute('aria-hidden', !isHidden);
        });
        
        const testButtons = tester.querySelectorAll('.test-btn');
        testButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.runAccessibilityTest(btn.getAttribute('data-test'));
            });
        });
    }

    runAccessibilityTest(testType) {
        switch (testType) {
            case 'contrast':
                this.testContrast();
                break;
            case 'focus':
                this.testFocusOrder();
                break;
            case 'labels':
                this.testLabels();
                break;
            case 'headings':
                this.testHeadings();
                break;
        }
    }

    testContrast() {
        // Simple contrast testing
        const elements = document.querySelectorAll('*');
        const issues = [];
        
        elements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                // This is a simplified test - real contrast testing is more complex
                element.style.outline = '2px solid orange';
                issues.push(element);
            }
        });
        
        console.log('Contrast issues found:', issues.length);
    }

    testFocusOrder() {
        // Test focus order
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach((element, index) => {
            element.style.outline = `2px solid ${index % 2 === 0 ? 'blue' : 'green'}`;
            element.setAttribute('data-focus-order', index);
        });
        
        console.log('Focus order tested for', focusableElements.length, 'elements');
    }

    testLabels() {
        // Test form labels
        const inputs = document.querySelectorAll('input, textarea, select');
        const unlabeled = [];
        
        inputs.forEach(input => {
            const hasLabel = document.querySelector(`label[for="${input.id}"]`) ||
                           input.getAttribute('aria-label') ||
                           input.getAttribute('aria-labelledby');
            
            if (!hasLabel) {
                input.style.outline = '2px solid red';
                unlabeled.push(input);
            }
        });
        
        console.log('Unlabeled inputs found:', unlabeled.length);
    }

    testHeadings() {
        // Test heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const issues = [];
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            const prevLevel = index > 0 ? parseInt(headings[index - 1].tagName.substring(1)) : 1;
            
            if (level > prevLevel + 1) {
                heading.style.outline = '2px solid red';
                issues.push(heading);
            }
        });
        
        console.log('Heading structure issues found:', issues.length);
    }

    // Utility methods
    announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById(`${priority}-live`);
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    generateId(element) {
        if (!element.id) {
            element.id = 'element-' + Math.random().toString(36).substr(2, 9);
        }
        return element.id;
    }

    closeModal(modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        
        // Return focus to trigger
        const trigger = document.querySelector(`[data-modal="${modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    }

    closeDropdown(dropdown) {
        dropdown.setAttribute('aria-expanded', 'false');
        
        // Return focus to trigger
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.focus();
        }
    }

    // Load saved accessibility settings
    loadAccessibilitySettings() {
        const fontSize = localStorage.getItem('fontSize');
        const contrast = localStorage.getItem('contrast');
        const motion = localStorage.getItem('motion');
        
        if (fontSize) {
            this.setFontSize(fontSize);
            document.getElementById('font-size').value = fontSize;
        }
        
        if (contrast) {
            this.setContrast(contrast);
            document.getElementById('contrast').value = contrast;
        }
        
        if (motion) {
            this.setMotion(motion);
            document.getElementById('motion').value = motion;
        }
    }
}

// Initialize accessibility manager
document.addEventListener('DOMContentLoaded', () => {
    const accessibilityManager = new AccessibilityManager();
    
    // Load saved settings
    accessibilityManager.loadAccessibilitySettings();
    
    // Make available globally
    window.AccessibilityManager = accessibilityManager;
});