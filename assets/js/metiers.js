// Careers JavaScript - Gestion des métiers et filtres (Version corrigée)

class CareersManager {
    constructor() {
        this.careers = [];
        this.filteredCareers = null;
        this.init();
    }

    async init() {
        console.log('Initializing CareersManager...');
        await this.loadCareers();
        this.renderCareers();
        this.setupModal();
        console.log('CareersManager initialized');
    }

    async loadCareers() {
        try {
            // Use global data object instead of fetch
            if (window.MOOWOOR_DATA && window.MOOWOOR_DATA.careers) {
                const data = window.MOOWOOR_DATA.careers;
                this.careers = data.careers || [];
                console.log('Careers loaded:', this.careers.length);
            } else {
                throw new Error('Global MOOWOOR_DATA not found');
            }
        } catch (error) {
            console.error('Error loading careers:', error);
            this.showError('Erreur lors du chargement des métiers');
        }
    }

    renderCareers() {
        const grid = document.getElementById('careersGrid');
        if (!grid) {
            console.error('careersGrid not found');
            return;
        }

        const careersToRender = this.filteredCareers || this.careers;

        if (!careersToRender || careersToRender.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">💼</div>
                    <h3>Aucun métier trouvé</h3>
                    <p>Essayez de modifier vos filtres pour voir plus de résultats.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = careersToRender.map((career, index) => `
            <div class="career-card scroll-animate" data-career-id="${career.id}" style="animation-delay: ${index * 0.1}s">
                <div class="career-card-header">
                    <div class="career-card-icon">${career.icon}</div>
                    <div class="career-card-info">
                        <h3 class="career-card-title">${career.title}</h3>
                        <span class="career-card-category">${this.getCategoryName(career.category)}</span>
                    </div>
                </div>
                <div class="career-card-body">
                    <p class="career-card-objective">${career.objective}</p>
                    ${career.skills && career.skills.length > 0 ? `
                        <div class="career-card-skills">
                            ${(career.skills || []).slice(0, 4).map(skill => `<span class="career-skill-tag">${skill}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="career-card-details">
                        <span class="career-card-level">${career.education_level}</span>
                        <span class="career-card-salary">${career.salary_range?.start || 'N/A'}</span>
                    </div>
                </div>
                <div class="career-card-footer">
                    <button class="btn btn-primary btn-sm career-details-btn" type="button" data-career-id="${career.id}">
                        Voir Détails
                    </button>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.career-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const careerId = btn.dataset.careerId;
                this.showCareerDetails(careerId);
            });
        });

        grid.querySelectorAll('.career-card').forEach(card => {
            card.addEventListener('click', () => {
                const careerId = card.dataset.careerId;
                this.showCareerDetails(careerId);
            });
        });

        // Re-trigger scroll animations
        this.triggerScrollAnimations();
        console.log('Careers rendered:', careersToRender.length);
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

                ${career.training_content && career.training_content.length > 0 ? `
                    <div class="career-details-section">
                        <h4>Modules de Formation</h4>
                        <ul class="career-details-content">
                            ${career.training_content.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

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

                ${career.employment_sectors && career.employment_sectors.length > 0 ? `
                    <div class="career-details-section">
                        <h4>Secteurs d'Emploi</h4>
                        <ul class="career-details-content">
                            ${career.employment_sectors.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${career.certifications && career.certifications.length > 0 ? `
                    <div class="career-details-section">
                        <h4>Certifications</h4>
                        <div class="career-details-skills">
                            ${career.certifications.map(certification => `<span class="career-skill-tag">${certification}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        modal.classList.add('active');
    }

    getCategoryName(category) {
        const categories = {
            'accompagnement': 'Accompagnement Patient',
            'plateforme': 'Gestion de Plateforme',
            'donnees': 'Données et Analytics',  // sans accent
            'données': 'Données et Analytics',  // avec accent (pour compatibilité)
            'ethique': 'Éthique et Conformité',
            'logistique': 'Logistique et Transferts',
            'consultation': 'Consultation et Soins',
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
    window.careersManager = new CareersManager();
});

// Export for use in other modules
window.MoowoorCareers = CareersManager;