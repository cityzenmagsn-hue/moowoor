// Hero Section JavaScript - Section héro unifiée

class HeroManager {
    constructor() {
        this.heroContent = null;
        this.currentPage = null;
        this.heroData = this.getHeroData();

        this.init();
    }

    init() {
        this.detectCurrentPage();
        this.createHeroSection();
        this.setupAnimations();
        this.setupInteractions();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();

        if (filename === 'index.html' || filename === '' || filename === '/') {
            this.currentPage = 'home';
        } else if (filename.includes('module')) {
            this.currentPage = 'modules';
        } else if (filename.includes('career')) {
            this.currentPage = 'careers';
        } else if (filename.includes('governance')) {
            this.currentPage = 'governance';
        } else if (filename.includes('parcours-patient')) {
            this.currentPage = 'parcours-patient';
        } else if (filename.includes('parcours-medicament')) {
            this.currentPage = 'parcours-medicament';
        } else if (filename.includes('parcours-etablissement')) {
            this.currentPage = 'parcours-etablissement';
        } else if (filename.includes('parcours-professionnel')) {
            this.currentPage = 'parcours-professionnel';
        } else if (filename.includes('doc')) {
            this.currentPage = 'docs';
        } else if (filename.includes('search')) {
            this.currentPage = 'search';
        } else if (filename.includes('download')) {
            this.currentPage = 'downloads';
        } else if (filename.includes('about')) {
            this.currentPage = 'about';
        } else if (filename.includes('offline')) {
            this.currentPage = 'offline';
        } else {
            this.currentPage = 'home';
        }
    }

    getHeroData() {
        return {
            home: {
                title: "Moowoor",
                subtitle: "La Santé Digitale pour le Sénégal",
                description: "Une suite complète de 15 modules basée sur Odoo pour la digitalisation du système de santé sénégalais",
                breadcrumb: null,
                icon: "🏥",
                actions: [
                    { text: "Découvrir les Modules", url: "pages/modules.html", primary: true },
                    { text: "En Savoir Plus", url: "pages/about.html", primary: false }
                ]
            },
            modules: {
                title: "Modules Moowoor",
                subtitle: "27 Modules Spécialisés",
                description: "Découvrez la suite complète de modules pour la digitalisation du système de santé sénégalais",
                breadcrumb: ["Accueil", "Modules"],
                icon: "📦",
                actions: [
                    { text: "Voir tous les modules", url: "#modules", primary: true }
                ]
            },
            careers: {
                title: "Métiers Digital Health",
                subtitle: "16 Nouveaux Métiers",
                description: "Explorez les carrières innovantes dans la santé digitale au Sénégal",
                breadcrumb: ["Accueil", "Métiers"],
                icon: "💼",
                actions: [
                    { text: "Explorer les métiers", url: "#careers", primary: true },
                    { text: "Formation", url: "#training", primary: false }
                ]
            },
            governance: {
                title: "Gouvernance",
                subtitle: "Architecture à 3 Niveaux",
                description: "Pilotage, régulation et exécution pour une gouvernance efficace de la santé digitale",
                breadcrumb: ["Accueil", "Gouvernance"],
                icon: "⚖️",
                actions: [
                    { text: "Découvrir l'architecture", url: "#governance", primary: true }
                ]
            },
            "parcours-patient": {
                title: "Parcours Patient",
                subtitle: "8 Étapes Digitales",
                description: "Le parcours digitalisé du patient dans le système de santé sénégalais",
                breadcrumb: ["Accueil", "Parcours Patient"],
                icon: "👤",
                actions: [
                    { text: "Voir le parcours", url: "#journey", primary: true }
                ]
            },
            "parcours-medicament": {
                title: "Parcours Médicament",
                subtitle: "9 Étapes de la Chaîne du Froid",
                description: "La digitalisation complète de la chaîne d'approvisionnement pharmaceutique",
                breadcrumb: ["Accueil", "Parcours Médicament"],
                icon: "💊",
                actions: [
                    { text: "Explorer la chaîne", url: "#journey", primary: true }
                ]
            },
            "parcours-etablissement": {
                title: "Parcours Établissement",
                subtitle: "6 Étapes de Validation",
                description: "Le parcours d'agrément et de validation des établissements de santé",
                breadcrumb: ["Accueil", "Parcours Établissement"],
                icon: "🏢",
                actions: [
                    { text: "Voir le parcours", url: "#journey", primary: true }
                ]
            },
            "parcours-professionnel": {
                title: "Parcours Professionnel",
                subtitle: "5 Étapes d'Inscription",
                description: "Le parcours d'inscription et de validation des professionnels de santé",
                breadcrumb: ["Accueil", "Parcours Professionnel"],
                icon: "👨‍⚕️",
                actions: [
                    { text: "Voir le parcours", url: "#journey", primary: true }
                ]
            },
            docs: {
                title: "Documentation Technique",
                subtitle: "Ressources Complètes",
                description: "Documentation technique, guides d'implémentation et bonnes pratiques",
                breadcrumb: ["Accueil", "Documentation"],
                icon: "📚",
                actions: [
                    { text: "Explorer les ressources", url: "#resources", primary: true },
                    { text: "API Reference", url: "#api", primary: false }
                ]
            },
            search: {
                title: "Recherche",
                subtitle: "Recherche Globale",
                description: "Recherchez dans tous les contenus de la documentation Moowoor",
                breadcrumb: ["Accueil", "Recherche"],
                icon: "🔍",
                actions: [
                    { text: "Commencer la recherche", url: "#search", primary: true }
                ]
            },
            downloads: {
                title: "Téléchargements",
                subtitle: "Ressources Disponibles",
                description: "Téléchargez les ressources, documents et outils Moowoor",
                breadcrumb: ["Accueil", "Téléchargements"],
                icon: "⬇️",
                actions: [
                    { text: "Télécharger les ressources", url: "#downloads", primary: true }
                ]
            },
            about: {
                title: "À Propos",
                subtitle: "Notre Mission",
                description: "Découvrez l'équipe, le manifeste et les réalisations du projet Moowoor",
                breadcrumb: ["Accueil", "À Propos"],
                icon: "ℹ️",
                actions: [
                    { text: "Découvrir notre histoire", url: "#about", primary: true }
                ]
            },
            offline: {
                title: "Hors Connexion",
                subtitle: "Mode Hors Ligne",
                description: "Accédez aux ressources mises en cache même sans connexion internet",
                breadcrumb: ["Accueil", "Hors Connexion"],
                icon: "📱",
                actions: [
                    { text: "Vérifier la connexion", url: "#check", primary: true }
                ]
            },
            default: {
                title: "Moowoor",
                subtitle: "Santé Digitale",
                description: "Suite de santé digitale pour le Sénégal",
                breadcrumb: ["Accueil"],
                icon: "🏥",
                actions: []
            }
        };
    }

    createHeroSection() {
        const data = this.heroData[this.currentPage] || this.heroData.default;

        // Supprimer l'ancienne hero section si elle existe
        const existingHero = document.querySelector('.hero-section');
        if (existingHero) {
            existingHero.remove();
        }

        // Créer le breadcrumb
        const breadcrumbHTML = data.breadcrumb ? this.createBreadcrumb(data.breadcrumb) : '';

        // Créer les actions
        const actionsHTML = this.createActions(data.actions);

        // Créer la hero section
        const heroHTML = `
            <section class="hero-section">
                <div class="container">
                    <div class="hero-content">
                        ${breadcrumbHTML}
                        <div class="hero-header">
                            <div class="hero-icon">${data.icon}</div>
                            <h1 class="hero-title">${data.title}</h1>
                            <h2 class="hero-subtitle">${data.subtitle}</h2>
                            <p class="hero-description">${data.description}</p>
                        </div>
                        ${actionsHTML}
                    </div>
                </div>
            </section>
        `;

        // Insérer la hero section au début du main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const container = mainContent.querySelector('.container');
            if (container) {
                container.insertAdjacentHTML('afterbegin', heroHTML);
            } else {
                mainContent.insertAdjacentHTML('afterbegin', `<div class="container">${heroHTML}</div>`);
            }
        }
    }

    createBreadcrumb(breadcrumb) {
        const links = breadcrumb.map((item, index) => {
            if (index === 0) {
                return `<a href="../index.html">${item}</a>`;
            } else {
                return `<span>${item}</span>`;
            }
        });

        return `
            <nav class="hero-breadcrumb" aria-label="Fil d'Ariane">
                ${links.join('<span class="hero-breadcrumb-separator">›</span>')}
            </nav>
        `;
    }

    createActions(actions) {
        if (!actions || actions.length === 0) return '';

        const actionButtons = actions.map(action => {
            const className = action.primary ? 'btn btn-primary' : 'btn btn-secondary';
            return `
                <a href="${action.url}" class="${className}">
                    ${action.text}
                </a>
            `;
        }).join('');

        return `
            <div class="hero-actions">
                ${actionButtons}
            </div>
        `;
    }

    setupAnimations() {
        // Animation au scroll pour le hero
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observer les éléments du hero
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-actions');
        heroElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupInteractions() {
        // Effet parallaxe sur le fond
        this.setupParallaxEffect();

        // Animations des particules
        this.createParticles();

        // Interaction avec le breadcrumb
        this.setupBreadcrumbInteractions();

        // Animations des actions
        this.setupActionAnimations();
    }

    setupParallaxEffect() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');

            if (heroSection) {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                heroSection.style.transform = `translateY(${yPos}px)`;
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    createParticles() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'hero-particles';

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(0, 212, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 5}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }

        heroSection.appendChild(particlesContainer);
    }

    setupBreadcrumbInteractions() {
        const breadcrumbLinks = document.querySelectorAll('.hero-breadcrumb a');

        breadcrumbLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateX(4px)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateX(0)';
            });
        });
    }

    setupActionAnimations() {
        const actionButtons = document.querySelectorAll('.hero-actions .btn');

        actionButtons.forEach((button, index) => {
            button.style.animationDelay = `${index * 0.1}s`;
            button.style.animation = 'slideInUp 0.5s ease forwards';
        });
    }

    // Méthodes publiques
    updateHero(page) {
        this.currentPage = page;
        this.createHeroSection();
        this.setupAnimations();
        this.setupInteractions();
    }

    getHeroDataForPage(page) {
        return this.heroData[page] || this.heroData.default;
    }
}

// CSS pour les animations
const heroStyles = document.createElement('style');
heroStyles.textContent = `
    .hero-section {
        position: relative;
        overflow: hidden;
    }
    
    .hero-particles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    }
    
    .hero-particle {
        animation: float linear infinite;
    }
    
    @keyframes float {
        0% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0;
        }
        10% { 
            opacity: 1; 
        }
        90% { 
            opacity: 1; 
        }
        100% { 
            transform: translateY(-100vh) translateX(100px); 
            opacity: 0;
        }
    }
    
    .hero-header {
        position: relative;
        z-index: 2;
    }
    
    .hero-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
        display: inline-block;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .hero-title {
        margin-bottom: var(--spacing-sm);
        opacity: 0;
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .hero-subtitle {
        color: var(--accent-primary);
        margin-bottom: var(--spacing-sm);
        opacity: 0;
        animation: fadeInUp 0.6s ease 0.1s forwards;
    }
    
    .hero-description {
        max-width: 600px;
        margin-bottom: var(--spacing-lg);
        opacity: 0;
        animation: fadeInUp 0.6s ease 0.2s forwards;
    }
    
    .hero-actions {
        opacity: 0;
        animation: fadeInUp 0.6s ease 0.3s forwards;
    }
    
    .hero-actions .btn {
        margin-right: var(--spacing-sm);
        margin-bottom: var(--spacing-sm);
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hero-animated .hero-title,
    .hero-animated .hero-subtitle,
    .hero-animated .hero-description,
    .hero-animated .hero-actions {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .hero-actions .btn {
            display: block;
            width: 100%;
            margin-right: 0;
        }
    }
`;

if (!document.querySelector('#hero-styles')) {
    heroStyles.id = 'hero-styles';
    document.head.appendChild(heroStyles);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que le DOM soit prêt
    setTimeout(() => {
        window.heroManager = new HeroManager();
    }, 100);
});

// Export pour utilisation externe
window.HeroManager = HeroManager;