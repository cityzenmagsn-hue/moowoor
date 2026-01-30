// Parcours Établissement JavaScript - Gestion du parcours établissement interactif

class ParcoursEtablissementManager {
    constructor() {
        this.journeySteps = [
            {
                id: 'demande',
                title: 'Demande',
                description: 'Soumission dossier établissement, documents légaux',
                icon: '📝',
                modules: ['FIIIMOOWOOR'],
                details: {
                    process: 'L\'établissement soumet sa demande d\'agrément via le portail FIIIMOOWOOR en téléversant tous les documents requis.',
                    benefits: ['Processus 100% digital', 'Guidage étape par étape', 'Archivage sécurisé'],
                    duration: '15-30 jours',
                    documents: ['Licence commerciale', 'Plan localisation', 'Certificat conformité', 'Liste équipements']
                }
            },
            {
                id: 'validation',
                title: 'Validation',
                description: 'Vérification documents, validation administrative',
                icon: '✅',
                modules: ['FIIIMOOWOOR', 'KIIIMOOWOOR'],
                details: {
                    process: 'Les services techniques vérifient la complétude et la conformité des documents, incluant la validation du personnel clé.',
                    benefits: ['Vérification croisée', 'Alerte documents manquants', 'Traçabilité validation'],
                    duration: '30-45 jours',
                    documents: ['Rapport de recevabilité', 'Vérification casiers judiciaires', 'Validation diplômes']
                }
            },
            {
                id: 'agrement',
                title: 'Agrément',
                description: 'Délivrance agrément officiel, catégorisation',
                icon: '🏆',
                modules: ['FIIIMOOWOOR'],
                details: {
                    process: 'Après validation, l\'agrément officiel est délivré, l\'établissement est catégorisé et un numéro unique est attribué.',
                    benefits: ['Autorisation officielle', 'Catégorie définie', 'Numéro unique'],
                    duration: '15-20 jours',
                    documents: ['Arrêté d\'agrément', 'Certificat d\'affichage', 'Cahier des charges']
                }
            },
            {
                id: 'publication',
                title: 'Publication',
                description: 'Publication registre public, génération QR code, géolocalisation GPS',
                icon: '🌍',
                modules: ['FIIIMOOWOOR'],
                details: {
                    process: 'L\'établissement est publié dans le registre national, géolocalisé sur la carte sanitaire, et reçoit son QR code d\'identification.',
                    benefits: ['Visibilité publique', 'Recherche avancée', 'Carte interactive'],
                    duration: '7-10 jours',
                    documents: ['Fiche publique', 'QR Code établissement', 'Coordonnées GPS']
                }
            },
            {
                id: 'inspection',
                title: 'Inspection',
                description: 'Inspections périodiques conformité',
                icon: '🔍',
                modules: ['INASANI Inspection', 'FIIIMOOWOOR'],
                details: {
                    process: 'Visites régulières pour vérifier le maintien des conditions d\'agrément (équipements, hygiène, personnel).',
                    benefits: ['Garantie qualité', 'Sécurité des soins', 'Amélioration continue'],
                    duration: 'Annuel',
                    documents: ['Rapport d\'inspection', 'Grille de contrôle', 'Mesures correctives']
                }
            },
            {
                id: 'renouvellement',
                title: 'Renouvellement',
                description: 'Renouvellement agrément annuel',
                icon: '🔄',
                modules: ['FIIIMOOWOOR'],
                details: {
                    process: 'Procédure annuelle de confirmation des informations et paiement des redevances pour maintenir l\'agrément.',
                    benefits: ['Mise à jour données', 'Continuité activité', 'Conformité continue'],
                    duration: 'Annuel',
                    documents: ['Demande renouvellement', 'Attestation paiement', 'Déclaration changements']
                }
            }
        ];
        this.currentStepIndex = -1;
        this.previousActiveElement = null;
        this.init();
    }

    init() {
        this.renderTimeline();
        this.setupModal();
        this.animateTimeline();
    }

    renderTimeline() {
        const container = document.getElementById('etablissementTimeline');
        if (!container) return;

        container.innerHTML = `
            <div class="timeline-container">
                ${this.journeySteps.map((step, index) => `
                    <div class="timeline-step scroll-animate" data-step-id="${step.id}" style="animation-delay: ${index * 0.1}s">
                        <div class="step-connector ${index === this.journeySteps.length - 1 ? 'last' : ''}"></div>
                        <div class="step-content">
                            <div class="step-icon">${step.icon}</div>
                            <div class="step-info">
                                <h3 class="step-title">${step.title}</h3>
                                <p class="step-description">${step.description}</p>
                                <div class="step-modules">
                                    ${step.modules.map(module =>
            `<span class="module-tag">${module}</span>`
        ).join('')}
                                </div>
                            </div>
                            <button class="step-details-btn" onclick="etablissementJourney.showStepDetails('${step.id}')">
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showStepDetails(stepId) {
        const step = this.journeySteps.find(s => s.id === stepId);
        if (!step) return;

        const modal = document.getElementById('stepModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = step.title;
        modalBody.innerHTML = `
            <div class="step-details">
                <div class="step-details-header">
                    <div class="step-details-icon">${step.icon}</div>
                    <div class="step-details-info">
                        <h3>${step.title}</h3>
                        <p class="step-details-description">${step.description}</p>
                        <div class="step-details-modules">
                            <strong>Modules concernés:</strong>
                            ${step.modules.map(module =>
            `<span class="module-tag">${module}</span>`
        ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="step-details-section">
                    <h4>Processus</h4>
                    <p>${step.details.process}</p>
                </div>

                <div class="step-details-section">
                    <h4>Bénéfices</h4>
                    <ul class="step-benefits">
                        ${step.details.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>

                <div class="step-details-section">
                    <h4>Durée Estimée</h4>
                    <div class="step-duration">
                        <div class="duration-icon">⏱️</div>
                        <span class="duration-value">${step.details.duration}</span>
                    </div>
                </div>

                <div class="step-details-section">
                    <h4>Documents et Prérequis</h4>
                    <div class="step-documents">
                        ${step.details.documents.map(doc =>
            `<div class="document-item">
                                <div class="document-icon">📄</div>
                                <span>${doc}</span>
                            </div>`
        ).join('')}
                    </div>
                </div>

                 <div class="step-details-section">
                    <h4>Intégration Écosystème</h4>
                    <div class="step-integration">
                        <div class="integration-flow-mini">
                            ${this.getStepIntegration(step)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const isAlreadyOpen = modal.classList.contains('active');
        if (!isAlreadyOpen) {
            this.previousActiveElement = document.activeElement;
        }

        this.currentStepIndex = this.journeySteps.findIndex(s => s.id === stepId);

        modal.classList.add('active');

        const closeBtn = document.getElementById('modalClose');
        if (closeBtn) {
            closeBtn.focus();
        }
    }

    getStepIntegration(step) {
        const integrationMap = {
            'demande': `
                <div class="integration-item">
                    <span class="integration-from">🏥 Demandeur</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📝 Portail FIIIMOOWOOR</span>
                </div>
            `,
            'validation': `
                <div class="integration-item">
                    <span class="integration-from">📝 Dossier</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">👨‍⚕️ Vérif. KIIIMOOWOOR</span>
                </div>
                 <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Vérification</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">⚖️ Ministère</span>
                </div>
            `,
            'agrement': `
                <div class="integration-item">
                    <span class="integration-from">⚖️ Validation</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏆 FIIIMOOWOOR</span>
                </div>
            `,
            'publication': `
                <div class="integration-item">
                    <span class="integration-from">🏆 Agrément</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🌍 Carte Sanitaire</span>
                </div>
            `,
            'inspection': `
                <div class="integration-item">
                    <span class="integration-from">🔍 INASANI</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏥 Établissement</span>
                </div>
            `,
            'renouvellement': `
                <div class="integration-item">
                    <span class="integration-from">🏥 Établissement</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏆 FIIIMOOWOOR</span>
                </div>
            `
        };
        return integrationMap[step.id] || '';
    }

    setupModal() {
        const modal = document.getElementById('stepModal');
        const modalClose = document.getElementById('modalClose');
        const modalCloseBtn = document.getElementById('modalCloseBtn');

        [modalClose, modalCloseBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.closeModal());
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                this.closeModal();
            } else if (e.key === 'ArrowLeft') {
                this.navigateStep(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigateStep(1);
            } else if (e.key === 'Tab') {
                this.handleFocusTrap(e, modal);
            }
        });
    }

    navigateStep(direction) {
        if (this.currentStepIndex === -1) return;

        const newIndex = this.currentStepIndex + direction;
        if (newIndex >= 0 && newIndex < this.journeySteps.length) {
            this.showStepDetails(this.journeySteps[newIndex].id);
        }
    }

    handleFocusTrap(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

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

    closeModal() {
        const modal = document.getElementById('stepModal');
        modal.classList.remove('active');
        this.currentStepIndex = -1;
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
            this.previousActiveElement = null;
        }
    }

    animateTimeline() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    const progressBar = entry.target.querySelector('.step-progress');
                    if (progressBar) {
                        setTimeout(() => {
                            progressBar.style.width = '100%';
                        }, 200);
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const steps = document.querySelectorAll('.timeline-step');
        steps.forEach(step => {
            observer.observe(step);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.etablissementJourney = new ParcoursEtablissementManager();
});

// Export for use in other modules
window.ParcoursEtablissementManager = ParcoursEtablissementManager;
