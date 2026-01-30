// Careers JavaScript - Gestion des métiers et filtres (Version corrigée)

class CareersManager {
    constructor() {
        this.careers = [];
        this.filteredCareers = [];
        this.activeFilters = {
            category: 'all',
            level: 'all'
        };
        this.init();
    }

    async init() {
        await this.loadCareers();
        this.setupFilters();
        this.renderCareers();
        this.setupModal();
    }

    async loadCareers() {
        try {
            const response = await fetch('../data/careers.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.careers = data.careers || [];
            this.filteredCareers = [...this.careers];
            console.log('Careers loaded:', this.careers.length);
            console.log('Sample career:', this.careers[0]);
        } catch (error) {
            console.error('Error loading careers:', error);
            this.showError('Erreur lors du chargement des métiers');
        }
    }

    setupFilters() {
        // Category filters
        const categoryFilters = document.getElementById('categoryFilters');
        if (categoryFilters) {
            categoryFilters.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-chip')) {
                    this.updateFilter('category', e.target.dataset.category, e.target);
                }
            });
        }

        // Level filters
        const levelFilters = document.getElementById('levelFilters');
        if (levelFilters) {
            levelFilters.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-chip')) {
                    this.updateFilter('level', e.target.dataset.level, e.target);
                }
            });
        }
    }

    updateFilter(filterType, value, element) {
        // Update active state
        const filterContainer = element.parentNode;
        filterContainer.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        element.classList.add('active');

        // Update filter
        this.activeFilters[filterType] = value;
        this.applyFilters();
    }

    applyFilters() {
        console.log('Applying filters:', this.activeFilters);
        console.log('Total careers available:', this.careers.length);
        
        if (!this.careers || this.careers.length === 0) {
            console.error('No careers data available');
            return;
        }
        
        const activeFilters = this.activeFilters;
        
        this.filteredCareers = this.careers.filter(careerItem => {
            if (!careerItem) return false;
            
            const categoryMatch = activeFilters.category === 'all' || 
                                careerItem.category === activeFilters.category;
            const levelMatch = activeFilters.level === 'all' || 
                             careerItem.education_level === activeFilters.level;
            
            return categoryMatch && levelMatch;
        });

        console.log('Filtered careers count:', this.filteredCareers.length);
        this.renderCareers();
    }

    renderCareers() {
        const grid = document.getElementById('careersGrid');
        if (!grid) {
            console.error('careersGrid element not found');
            return;
        }

        console.log('Rendering careers, count:', this.filteredCareers.length);

        if (this.filteredCareers.length === 0) {
            console.log('No careers to display');
            grid.innerHTML = `
                <div class="col-span-full">
                    <p class="text-muted">Aucun métier trouvé pour les filtres sélectionnés</p>
                    <button class="btn btn-secondary mt-md" onclick="window.moowoorCareers.resetFilters()">
                        Réinitialiser les filtres
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredCareers.map((careerItem, index) => {
            console.log(`Rendering career ${index + 1}: ${careerItem.title}`);
            return `
                <div class="career-card scroll-animate" data-career-id="${careerItem.id}" style="animation-delay: ${index * 0.1}s">
                    <div class="career-card-header">
                        <div class="career-card-icon">${careerItem.icon || '💼'}</div>
                        <h3 class="career-card-title">${careerItem.title}</h3>
                        <div class="career-card-level">${careerItem.education_level}</div>
                    </div>
                    <div class="career-card-body">
                        <p class="career-card-objective">${careerItem.objective}</p>
                        
                        <div class="career-card-skills">
                            <div class="career-card-skills-title">Compétences Clés</div>
                            <div class="career-card-skills-list">
                                ${(careerItem.skills || []).slice(0, 4).map(skill => 
                                    `<span class="career-skill-tag">${skill}</span>`
                                ).join('')}
                                ${(careerItem.skills || []).length > 4 ? 
                                    `<span class="career-skill-tag">+${(careerItem.skills || []).length - 4}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="career-card-footer">
                        <div class="career-duration">
                            <strong>Formation:</strong> ${careerItem.training_duration || 'N/A'}
                        </div>
                        <div class="career-salary">
                            <strong>Salaire:</strong> ${careerItem.salary_range ? `${careerItem.salary_range.start} - ${careerItem.salary_range.senior}` : 'N/A'}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        grid.querySelectorAll('.career-card').forEach(card => {
            card.addEventListener('click', () => {
                const careerId = card.dataset.careerId;
                this.showCareerDetails(careerId);
            });
        });

        // Re-trigger scroll animations
        this.triggerScrollAnimations();
    }

    resetFilters() {
        this.activeFilters = {
            category: 'all',
            level: 'all'
        };
        
        // Reset UI
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelectorAll('[data-category="all"], [data-level="all"]').forEach(chip => {
            chip.classList.add('active');
        });
        
        this.filteredCareers = [...this.careers];
        this.renderCareers();
    }

    showCareerDetails(careerId) {
        const career = this.careers.find(c => c.id === careerId);
        if (!career) return;

        const modal = document.getElementById('careerModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = career.title;
        modalBody.innerHTML = `
            <div class="career-details">
                <div class="career-details-header">
                    <div class="career-details-icon">${career.icon || '💼'}</div>
                    <div class="career-details-info">
                        <h3>${career.title}</h3>
                        <p class="career-details-category">${this.getCategoryName(career.category)}</p>
                        <div class="career-details-meta">
                            <span class="badge">${career.education_level}</span>
                            <span class="badge badge-${career.category}">${this.getCategoryName(career.category)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="career-details-section">
                    <h4>Objectif du Métier</h4>
                    <p>${career.objective}</p>
                </div>

                <div class="career-details-section">
                    <h4>Description</h4>
                    <p>${career.description}</p>
                </div>

                <div class="career-details-section">
                    <h4>Contenu du Poste</h4>
                    <ul class="career-details-content">
                        ${(career.content || []).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>

                <div class="career-details-section">
                    <h4>Compétences Requises</h4>
                    <div class="career-details-skills">
                        ${(career.skills || []).map(skill => 
                            `<span class="career-skill-tag">${skill}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="career-details-section">
                    <h4>Formation</h4>
                    <div class="career-details-training">
                        <div class="training-item">
                            <strong>Niveau requis:</strong> ${career.education_level}
                        </div>
                        <div class="training-item">
                            <strong>Diplôme requis:</strong> ${career.required_diploma}
                        </div>
                        <div class="training-item">
                            <strong>Durée formation:</strong> ${career.training_duration}
                        </div>
                    </div>
                </div>

                <div class="career-details-section">
                    <h4>Perspectives de Carrière</h4>
                    <ul class="career-details-prospects">
                        ${(career.career_prospects || []).map(prospect => `<li>${prospect}</li>`).join('')}
                    </ul>
                </div>

                <div class="career-details-section">
                    <h4>Rémunération</h4>
                    <div class="career-details-salary">
                        ${career.salary_range ? `
                            <div class="salary-range">
                                <span>Début:</span> <strong>${career.salary_range.start}</strong>
                            </div>
                            <div class="salary-range">
                                <span>Moyen:</span> <strong>${career.salary_range.mid}</strong>
                            </div>
                            <div class="salary-range">
                                <span>Senior:</span> <strong>${career.salary_range.senior}</strong>
                            </div>
                        ` : '<p>Information non disponible</p>'}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    getCategoryName(category) {
        const categories = {
            'logistique': 'Logistique et Transferts',
            'consultation': 'Consultation et Soins',
            'données': 'Données et Analytics',
            'coordination': 'Coordination et Parcours',
            'support': 'Support Technique',
            'gestion': 'Gestion et Administration',
            'qualité': 'Qualité et Conformité',
            'intégration': 'Intégration Systèmes',
            'conseil': 'Conseil et Accompagnement',
            'supervision': 'Supervision et Management'
        };
        return categories[category] || category;
    }

    setupModal() {
        const modal = document.getElementById('careerModal');
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
        const modal = document.getElementById('careerModal');
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
        const grid = document.getElementById('careersGrid');
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
        const searchInput = document.getElementById('searchCareers');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.searchCareers(query);
            });
        }
    }

    searchCareers(query) {
        if (query.length < 2) {
            this.applyFilters();
            return;
        }

        this.filteredCareers = this.careers.filter(career => {
            const searchString = `
                ${career.title} 
                ${career.description} 
                ${career.objective}
                ${(career.skills || []).join(' ')} 
                ${this.getCategoryName(career.category)}
            `.toLowerCase();
            
            return searchString.includes(query);
        });

        this.renderCareers();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.moowoorCareers = new CareersManager();
});

// Export for use in other modules
window.MoowoorCareers = CareersManager;