// Documentation JavaScript - Interactive docs functionality

class DocsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupCodeBlocks();
        this.setupCopyButtons();
        this.setupSearch();
        this.setupSmoothScroll();
        this.setupTableOfContents();
    }

    setupNavigation() {
        // Handle hash navigation
        if (window.location.hash) {
            const element = document.querySelector(window.location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const nav = document.querySelector('.nav');
                    const navHeight = nav ? nav.offsetHeight : 80;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash
                    window.history.pushState(null, null, targetId);
                }
            });
        });
    }

    setupCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            const pre = block.parentElement;
            
            // Add language label
            const language = this.detectLanguage(block);
            if (language) {
                const label = document.createElement('div');
                label.className = 'code-language';
                label.textContent = language;
                pre.appendChild(label);
            }
            
            // Add line numbers
            const lines = block.textContent.split('\n');
            const lineNumbers = document.createElement('div');
            lineNumbers.className = 'code-line-numbers';
            lineNumbers.innerHTML = lines.map((_, index) => 
                `<span>${index + 1}</span>`
            ).join('');
            pre.classList.add('code-with-lines');
            pre.appendChild(lineNumbers);
        });
    }

    detectLanguage(codeBlock) {
        const text = codeBlock.textContent;
        const classes = codeBlock.className;
        
        if (classes.includes('language-python') || text.includes('def ') || text.includes('import ')) {
            return 'Python';
        }
        if (classes.includes('language-javascript') || text.includes('const ') || text.includes('function ')) {
            return 'JavaScript';
        }
        if (classes.includes('language-sql') || text.includes('SELECT ') || text.includes('FROM ')) {
            return 'SQL';
        }
        if (classes.includes('language-bash') || text.includes('pip ') || text.includes('npm ')) {
            return 'Bash';
        }
        if (classes.includes('language-json') || text.includes('{') || text.includes('"')) {
            return 'JSON';
        }
        
        return null;
    }

    setupCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach(pre => {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '📋';
            copyButton.title = 'Copier le code';
            
            copyButton.addEventListener('click', () => {
                const code = pre.querySelector('code');
                if (code) {
                    this.copyToClipboard(code.textContent);
                    copyButton.innerHTML = '✅';
                    copyButton.title = 'Copié!';
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '📋';
                        copyButton.title = 'Copier le code';
                    }, 2000);
                }
            });
            
            pre.appendChild(copyButton);
        });
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Code copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy text:', err);
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            console.log('Code copied using fallback method');
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
        
        document.body.removeChild(textArea);
    }

    setupSearch() {
        // This would connect to the main search functionality
        // For now, just ensure the search works within docs
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.highlightSearchTerms(query);
            });
        }
    }

    highlightSearchTerms(query) {
        if (query.length < 3) {
            this.removeHighlights();
            return;
        }

        const sections = document.querySelectorAll('.docs-card, .docs-section');
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(query)) {
                section.style.border = '2px solid var(--accent-primary)';
                section.style.boxShadow = 'var(--shadow-glow)';
            } else {
                section.style.border = '1px solid var(--border-color)';
                section.style.boxShadow = 'var(--shadow-md)';
            }
        });
    }

    removeHighlights() {
        const sections = document.querySelectorAll('.docs-card, .docs-section');
        sections.forEach(section => {
            section.style.border = '1px solid var(--border-color)';
            section.style.boxShadow = 'var(--shadow-md)';
        });
    }

    setupSmoothScroll() {
        // Enhanced smooth scrolling with offsets
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupTableOfContents() {
        // Generate table of contents if needed
        const tocContainer = document.querySelector('.table-of-contents');
        if (tocContainer) {
            const headings = document.querySelectorAll('h2, h3, h4');
            const toc = document.createElement('ul');
            toc.className = 'toc-list';
            
            headings.forEach((heading, index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#heading-${index}`;
                a.textContent = heading.textContent;
                a.className = `toc-${heading.tagName.toLowerCase()}`;
                
                // Add ID to heading
                heading.id = `heading-${index}`;
                
                li.appendChild(a);
                toc.appendChild(li);
                
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    heading.scrollIntoView({ behavior: 'smooth' });
                });
            });
            
            tocContainer.appendChild(toc);
        }
    }

    setupAccordion() {
        const accordions = document.querySelectorAll('.accordion');
        
        accordions.forEach(accordion => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            if (header && content) {
                header.addEventListener('click', () => {
                    const isOpen = accordion.classList.contains('open');
                    
                    if (isOpen) {
                        accordion.classList.remove('open');
                        content.style.maxHeight = '0';
                    } else {
                        accordion.classList.add('open');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    setupTabs() {
        const tabGroups = document.querySelectorAll('.tab-group');
        
        tabGroups.forEach(group => {
            const tabs = group.querySelectorAll('.tab');
            const contents = group.querySelectorAll('.tab-content');
            
            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and contents
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    tab.classList.add('active');
                    if (contents[index]) {
                        contents[index].classList.add('active');
                    }
                });
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DocsManager();
});

// Export for use in other modules
window.MoowoorDocs = DocsManager;