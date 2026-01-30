// Sidebar JavaScript - Navigation latérale réactive

class SidebarManager {
    constructor() {
        this.sidebar = null;
        this.toggle = null;
        this.overlay = null;
        this.links = null;
        this.activeSection = null;

        this.init();
    }

    init() {
        this.createSidebarHTML();
        this.setupElements();
        this.setupEventListeners();
        this.setupActiveNavigation();
        this.setupScrollEffects();
    }

    createSidebarHTML() {
        // Créer le HTML de la sidebar si non existant
        if (!document.querySelector('.sidebar')) {
            // Détecter le contexte de navigation
            const isInPagesFolder = window.location.pathname.includes('/pages/');
            const homePrefix = isInPagesFolder ? '../' : '';
            const pagesPrefix = isInPagesFolder ? '' : 'pages/';

            const sidebarHTML = `
                <aside class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <a href="${homePrefix}index.html" class="sidebar-logo">
                            <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
                                <circle cx="20" cy="20" r="18" stroke="#00d4ff" stroke-width="2"/>
                                <path d="M12 20 L20 12 L28 20 L20 28 Z" fill="#00d4ff"/>
                                <circle cx="20" cy="20" r="3" fill="#0a0e27"/>
                            </svg>
                            <span>MOOWOOR</span>
                        </a>
                    </div>
                    
                    <nav class="sidebar-menu" role="navigation" aria-label="Navigation principale">
                        <div class="sidebar-section">
                            <div class="sidebar-section-title">Principal</div>
                            <a href="${homePrefix}index.html" class="sidebar-link" data-page="home">
                                <span class="sidebar-link-icon">🏠</span>
                                <span>Accueil</span>
                            </a>
                            <a href="${pagesPrefix}modules.html" class="sidebar-link" data-page="modules">
                                <span class="sidebar-link-icon">📦</span>
                                <span>Modules</span>
                            </a>
                            <a href="${pagesPrefix}metiers.html" class="sidebar-link" data-page="metiers">
                                <span class="sidebar-link-icon">💼</span>
                                <span>Métiers</span>
                            </a>
                        </div>
                        
                        <div class="sidebar-section">
                            <div class="sidebar-section-title">Organisation</div>
                            <a href="${pagesPrefix}gouvernance.html" class="sidebar-link" data-page="gouvernance">
                                <span class="sidebar-link-icon">⚖️</span>
                                <span>Gouvernance</span>
                            </a>
                            <a href="${pagesPrefix}dfu.html" class="sidebar-link" data-page="dfu">
                                <span class="sidebar-link-icon">👨‍👩‍👧‍👦</span>
                                <span>DFU</span>
                            </a>
                        </div>

                        <div class="sidebar-section">
                            <div class="sidebar-section-title">Parcours</div>
                            <a href="${pagesPrefix}parcours-patient.html" class="sidebar-link" data-page="parcours-patient">
                                <span class="sidebar-link-icon">👤</span>
                                <span>Parcours Patient</span>
                            </a>
                            <a href="${pagesPrefix}parcours-medicament.html" class="sidebar-link" data-page="parcours-medicament">
                                <span class="sidebar-link-icon">💊</span>
                                <span>Parcours Médicament</span>
                            </a>
                            <a href="${pagesPrefix}parcours-etablissement.html" class="sidebar-link" data-page="parcours-etablissement">
                                <span class="sidebar-link-icon">🏢</span>
                                <span>Parcours Établissement</span>
                            </a>
                            <a href="${pagesPrefix}parcours-professionnel.html" class="sidebar-link" data-page="parcours-professionnel">
                                <span class="sidebar-link-icon">👨‍⚕️</span>
                                <span>Parcours Professionnel</span>
                            </a>
                        </div>
                        
                        <div class="sidebar-section">
                            <div class="sidebar-section-title">Ressources</div>
                            <a href="${pagesPrefix}docs.html" class="sidebar-link" data-page="docs">
                                <span class="sidebar-link-icon">📚</span>
                                <span>Documentation</span>
                            </a>
                            <a href="${pagesPrefix}search.html" class="sidebar-link" data-page="search">
                                <span class="sidebar-link-icon">🔍</span>
                                <span>Recherche</span>
                            </a>
                            <a href="${pagesPrefix}downloads.html" class="sidebar-link" data-page="downloads">
                                <span class="sidebar-link-icon">⬇️</span>
                                <span>Téléchargements</span>
                            </a>
                        </div>
                        
                        <div class="sidebar-section">
                            <div class="sidebar-section-title">Information</div>
                            <a href="${pagesPrefix}about.html" class="sidebar-link" data-page="about">
                                <span class="sidebar-link-icon">ℹ️</span>
                                <span>À Propos</span>
                            </a>
                        </div>
                    </nav>
                </aside>
                
                <button class="sidebar-toggle" id="sidebarToggle" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                
                <div class="mobile-overlay" id="mobileOverlay"></div>
            `;

            // Insérer au début du body
            document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
        }
    }

    setupElements() {
        this.sidebar = document.getElementById('sidebar');
        this.toggle = document.getElementById('sidebarToggle');
        this.overlay = document.getElementById('mobileOverlay');
        this.links = document.querySelectorAll('.sidebar-link');

        // Wrapper pour le layout
        // Wrapper pour le layout
        if (!document.querySelector('.layout-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'layout-wrapper';
            wrapper.style.display = 'flex';
            wrapper.style.minHeight = '100vh';

            // Ajouter la sidebar
            wrapper.appendChild(this.sidebar);

            // Créer le main content wrapper
            const mainContentWrapper = document.createElement('main');
            mainContentWrapper.className = 'main-content';

            // Déplacer tout le contenu existant dans main-content
            const existingElements = Array.from(document.body.children);
            existingElements.forEach(element => {
                if (!element.classList.contains('sidebar') &&
                    !element.classList.contains('sidebar-toggle') &&
                    !element.classList.contains('mobile-overlay')) {
                    mainContentWrapper.appendChild(element);
                }
            });

            wrapper.appendChild(mainContentWrapper);

            // Réinsérer le wrapper dans le body
            document.body.innerHTML = '';
            document.body.appendChild(wrapper);

            // Déplacer le toggle et l'overlay
            document.body.appendChild(this.toggle);
            document.body.appendChild(this.overlay);
        }
    }

    setupEventListeners() {
        // Toggle sidebar
        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });

        // Navigation links
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Fermer la sidebar sur mobile après navigation
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.closeSidebar();
                    }, 100);
                }
            });
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Ajout de l'effet hover
        this.setupHoverEffects();
    }

    setupActiveNavigation() {
        // Détecter la page active
        const currentPage = this.detectCurrentPage();

        // Mettre à jour les liens actifs
        this.links.forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mettre à jour le titre de la page
        this.updatePageTitle(currentPage);
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();

        // Cas spéciaux
        if (filename === 'index.html' || filename === '' || filename === '/') {
            return 'home';
        }

        // Détecter depuis le nom du fichier
        if (filename.includes('module')) return 'modules';
        if (filename.includes('metier')) return 'metiers';
        if (filename.includes('gouvern')) return 'gouvernance';
        if (filename.includes('parcours-patient')) return 'parcours-patient';
        if (filename.includes('parcours-medicament')) return 'parcours-medicament';
        if (filename.includes('parcours-etablissement')) return 'parcours-etablissement';
        if (filename.includes('parcours-professionnel')) return 'parcours-professionnel';
        if (filename.includes('doc')) return 'docs';
        if (filename.includes('search')) return 'search';
        if (filename.includes('download')) return 'downloads';
        if (filename.includes('about')) return 'about';
        if (filename.includes('offline')) return 'offline';

        return 'unknown';
    }

    updatePageTitle(page) {
        const titles = {
            'home': 'Accueil - Moowoor',
            'modules': 'Modules - Moowoor',
            'metiers': 'Métiers - Moowoor',
            'gouvernance': 'Gouvernance - Moowoor',
            'dfu': 'DFU - Dossier Familial Unifié - Moowoor',
            'parcours-patient': 'Parcours Patient - Moowoor',
            'parcours-medicament': 'Parcours Médicament - Moowoor',
            'parcours-etablissement': 'Parcours Établissement - Moowoor',
            'parcours-professionnel': 'Parcours Professionnel - Moowoor',
            'docs': 'Documentation - Moowoor',
            'search': 'Recherche - Moowoor',
            'downloads': 'Téléchargements - Moowoor',
            'about': 'À Propos - Moowoor',
            'offline': 'Hors Connexion - Moowoor'
        };

        if (titles[page]) {
            document.title = titles[page];
        }
    }

    toggleSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.toggle('active');
            this.toggle?.classList.toggle('active');
            this.overlay?.classList.toggle('active');

            // Empêcher le scroll du body quand sidebar ouverte
            document.body.style.overflow = this.sidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    closeSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.remove('active');
            this.toggle?.classList.remove('active');
            this.overlay?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeSidebar();
        }
    }

    setupHoverEffects() {
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const icon = link.querySelector('.sidebar-link-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                }
            });

            link.addEventListener('mouseleave', () => {
                const icon = link.querySelector('.sidebar-link-icon');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });
    }

    setupScrollEffects() {
        // Effet de scroll sur la sidebar
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Sur mobile, cacher la sidebar quand on scroll down
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    this.toggle?.classList.add('hidden');
                } else {
                    this.toggle?.classList.remove('hidden');
                }
            }

            lastScrollY = currentScrollY;
        });
    }

    // Méthodes publiques
    openSidebar() {
        this.sidebar?.classList.add('active');
        this.toggle?.classList.add('active');
        this.overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    isSidebarOpen() {
        return this.sidebar?.classList.contains('active') || false;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
});

// Export pour utilisation externe
window.SidebarManager = SidebarManager;