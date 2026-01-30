// Modules JavaScript - Gestion des modules et filtres

class ModulesManager {
    constructor() {
        this.modules = [];
        this.filteredModules = null;
        this.init();
    }

    async init() {
        console.log('Initializing ModulesManager...');
        await this.loadModules();
        this.renderModules();
        this.setupModal();
        console.log('ModulesManager initialized');
    }

    async loadModules() {
        try {
            // Use global data object instead of fetch
            if (window.MOOWOOR_DATA && window.MOOWOOR_DATA.modules) {
                const data = window.MOOWOOR_DATA.modules;
                this.modules = data.modules;
                console.log('Modules loaded:', this.modules.length);
            } else {
                throw new Error('Global MOOWOOR_DATA not found');
            }
        } catch (error) {
            console.error('Error loading modules:', error);
            this.showError('Impossible de charger les modules.');
        }
    }

    renderModules() {
        const grid = document.getElementById('modulesGrid');
        if (!grid) {
            console.error('modulesGrid not found');
            return;
        }

        // Ensure we have modules to render
        const modulesToRender = this.filteredModules || this.modules;

        if (!modulesToRender || modulesToRender.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">📦</div>
                    <h3>Aucun module trouvé</h3>
                    <p>Essayez de modifier vos filtres pour voir plus de résultats.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = modulesToRender.map((module, index) => `
            <div class="module-card scroll-animate" data-module-id="${module.id}" style="animation-delay: ${index * 0.1}s">
                <div class="module-card-header">
                    <div class="module-card-icon">${module.icon}</div>
                    <div class="module-card-title">${module.name}</div>
                    <div class="module-card-category">${this.getCategoryName(module.category)}${module.subcategory ? ` • ${module.subcategory}` : ''}</div>
                </div>
                <div class="module-card-body">
                    <p class="module-card-description">${module.description}</p>
                    <ul class="module-card-features">
                        ${module.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="module-card-footer">
                    <span class="module-card-status">${this.getStatusLabel(module.status)}</span>
                    <span class="module-card-version">v${module.version}</span>
                </div>
                <div class="module-card-footer">
                    <button class="btn btn-primary btn-sm module-details-btn" type="button" data-module-id="${module.id}">
                        Voir Détails
                    </button>
                </div>
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('click', () => {
                const moduleId = card.dataset.moduleId;
                this.showModuleDetails(moduleId);
            });
        });

        grid.querySelectorAll('.module-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const moduleId = btn.dataset.moduleId;
                this.showModuleDetails(moduleId);
            });
        });

        // Re-trigger scroll animations
        this.triggerScrollAnimations();
        console.log('Modules rendered:', modulesToRender.length);
    }

    getCategoryName(category) {
        const categories = {
            'hospital': 'Gestion Hospitalière',
            'pharmacie': 'Régulation Pharmaceutique',
            'registres': 'Registres Nationaux',
            'applications': 'Applications Spécialisées',
            'transversaux': 'Modules Transversaux'
        };
        return categories[category] || category;
    }

    getStatusLabel(status) {
        const labels = {
            'production': 'Production',
            'development': 'Développement',
            'testing': 'Test',
            'deprecated': 'Obsolète'
        };
        return labels[status] || status;
    }

    getParcoursTypeLabel(type) {
        const labels = {
            'patient': 'Parcours Patient',
            'medicament': 'Parcours Médicament',
            'etablissement': 'Parcours Établissement',
            'professionnel': 'Parcours Professionnel'
        };
        return labels[type] || type;
    }

    showModuleDetails(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return;

        const modal = document.getElementById('moduleModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = module.name;
        modalBody.innerHTML = `
            <div class="module-details">
                <div class="module-details-header">
                    <div class="module-details-icon">${module.icon}</div>
                    <div class="module-details-info">
                        <h3>${module.name}</h3>
                        <p class="module-details-category">${this.getCategoryName(module.category)}</p>
                        ${module.subcategory ? `<p class="module-details-subcategory">${module.subcategory}</p>` : ''}
                        <div class="module-details-meta">
                            <span class="badge">Version ${module.version}</span>
                            <span class="badge badge-${module.status}">${this.getStatusLabel(module.status)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="module-details-section">
                    <h4>Description</h4>
                    <p>${module.description}</p>
                </div>

                <div class="module-details-section">
                    <h4>Fonctionnalités</h4>
                    <ul class="module-details-features">
                        ${module.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>

                <div class="module-details-section">
                    <h4>Intégrations</h4>
                    <div class="module-details-integrations">
                        ${module.integrations && module.integrations.length > 0
                ? module.integrations.map(integration => `<span class="integration-tag">${integration}</span>`).join('')
                : '<p class="text-muted">Aucune intégration externe</p>'}
                    </div>
                </div>

                ${module.parcours ? `
                    <div class="module-details-section">
                        <h4>Parcours</h4>
                        <div class="module-details-parcours">
                            ${Object.entries(module.parcours).map(([type, steps]) => `
                                <div class="parcours-type">
                                    <h5>${this.getParcoursTypeLabel(type)}</h5>
                                    <ol class="parcours-steps">
                                        ${steps.map(step => `<li>${step}</li>`).join('')}
                                    </ol>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="module-details-section">
                    <h4>Informations Techniques</h4>
                    <div class="module-details-technical">
                        <div class="technical-item">
                            <strong>Chemin:</strong> ${module.path}
                        </div>
                        <div class="technical-item">
                            <strong>Auteurs:</strong> ${module.authors}
                        </div>
                        <div class="technical-item">
                            <strong>Dépendances:</strong> 
                            ${module.dependencies.length > 0 ? module.dependencies.join(', ') : 'Aucune'}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    setupModal() {
        const modal = document.getElementById('moduleModal');
        const modalClose = document.getElementById('modalClose');
        const modalCloseBtn = document.getElementById('modalCloseBtn');

        // Close buttons
        [modalClose, modalCloseBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.closeModal());
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('moduleModal');
        modal.classList.remove('active');
    }

    triggerScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-animate');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    showError(message) {
        const grid = document.getElementById('modulesGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center">
                    <div class="error-message">
                        <p>${message}</p>
                        <button class="btn btn-primary mt-md" onclick="location.reload()">
                            Réessayer
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Search functionality
    setupSearch() {
        const searchInput = document.getElementById('searchModules');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.searchModules(query);
            });
        }
    }

    searchModules(query) {
        if (query.length < 2) {
            this.applyFilters();
            return;
        }

        this.filteredModules = this.modules.filter(module => {
            const searchString = `
                ${module.name} 
                ${module.description} 
                ${module.features.join(' ')} 
                ${this.getCategoryName(module.category)}
            `.toLowerCase();

            return searchString.includes(query);
        });

        this.renderModules();
    }

    // Sort functionality
    setupSort() {
        const sortSelect = document.getElementById('sortModules');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortModules(e.target.value);
            });
        }
    }

    sortModules(sortBy) {
        switch (sortBy) {
            case 'name':
                this.filteredModules.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'category':
                this.filteredModules.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'status':
                this.filteredModules.sort((a, b) => a.status.localeCompare(b.status));
                break;
            case 'version':
                this.filteredModules.sort((a, b) => b.version.localeCompare(a.version));
                break;
            default:
                this.filteredModules.sort((a, b) => a.name.localeCompare(b.name));
        }

        this.renderModules();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.modulesManager = new ModulesManager();
});

// Export for use in other modules
window.MoowoorModules = ModulesManager;