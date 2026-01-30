// Parcours Professionnel JavaScript - Gestion du parcours professionnel interactif

class ParcoursProfessionnelManager {
    constructor() {
        this.journeySteps = [
            {
                id: 'inscription',
                title: 'Inscription',
                description: 'Soumission dossier professionnel',
                icon: '📝',
                modules: ['KIIIMOOWOOR'],
                details: {
                    process: 'Le professionnel crée son compte et soumet ses documents d\'identification et de qualification sur la plateforme.',
                    benefits: ['Inscription unique', 'Identifiant national', 'Numérisation documents'],
                    duration: '10-15 jours',
                    documents: ['Diplômes', 'Pièce identité', 'CV professionnel', 'Photo', 'Certificat bonne vie et mœurs']
                }
            },
            {
                id: 'validation-ordre',
                title: 'Validation Ordre',
                description: 'Examen dossier par ordre professionnel',
                icon: '✅',
                modules: ['KIIIMOOWOOR', 'Ordres'],
                details: {
                    process: 'L\'Ordre professionnel compétent vérifie l\'authenticité des diplômes et valide l\'inscription au tableau.',
                    benefits: ['Vérification par les pairs', 'Garantie déontologique', 'Validation officielle'],
                    duration: '30-60 jours',
                    documents: ['Dossier complet vérifié', 'Attestation de l\'Ordre', 'Procès-verbal de prestation de serment']
                }
            },
            {
                id: 'cotisation',
                title: 'Cotisation',
                description: 'Paiement cotisation annuelle obligatoire',
                icon: '💰',
                modules: ['KIIIMOOWOOR'],
                details: {
                    process: 'Paiement sécurisé de la cotisation annuelle obligatoire pour l\'exercice de la profession.',
                    benefits: ['Paiement en ligne', 'Reçu automatique', 'Traçabilité financière'],
                    duration: 'Annuel',
                    documents: ['Reçu de paiement', 'Attestation de régularité', 'Carte de membre']
                }
            },
            {
                id: 'exercice',
                title: 'Exercice',
                description: 'Autorisation exercice, publication registre public, QR code',
                icon: '👨‍⚕️',
                modules: ['KIIIMOOWOOR'],
                details: {
                    process: 'Activation de l\'autorisation d\'exercer, génération de la carte professionnelle numérique et publication dans l\'annuaire.',
                    benefits: ['Carte professionnelle', 'QR code vérification', 'Profil public', 'Intégration établissements'],
                    duration: 'Immédiat',
                    documents: ['Autorisation d\'exercice', 'Carte professionnelle virtuelle', 'QR Code professionnel']
                }
            },
            {
                id: 'renouvellement',
                title: 'Renouvellement',
                description: 'Renouvellement annuel cotisation et mise à jour',
                icon: '🔄',
                modules: ['KIIIMOOWOOR'],
                details: {
                    process: 'Mise à jour annuelle des informations, déclaration des formations continues et renouvellement de la cotisation.',
                    benefits: ['Maintien des droits', 'Mise à jour compétences', 'Conformité continue'],
                    duration: 'Annuel',
                    documents: ['Attestation de formation', 'Dossier de renouvellement', 'Nouvelle carte annuelle']
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
        const container = document.getElementById('professionnelTimeline');
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
                            <button class="step-details-btn" onclick="professionnelJourney.showStepDetails('${step.id}')">
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
                    <h4>Documents Requis</h4>
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
                    <h4>Intégration Institutionnelle</h4>
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
            'inscription': `
                <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Pro</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📝 KIIIMOOWOOR</span>
                </div>
            `,
            'validation-ordre': `
                 <div class="integration-item">
                    <span class="integration-from">📝 Dossier</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">⚖️ Ordre Pro</span>
                </div>
                 <div class="integration-item">
                    <span class="integration-from">⚖️ Ordre</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">✅ KIIIMOOWOOR</span>
                </div>
            `,
            'cotisation': `
                 <div class="integration-item">
                    <span class="integration-from">💳 Paiement</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">💰 Trésorerie Ordre</span>
                </div>
            `,
            'exercice': `
                 <div class="integration-item">
                    <span class="integration-from">✅ Validé</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🌍 Annuaire Public</span>
                </div>
                 <div class="integration-item">
                    <span class="integration-from">🌍 Annuaire</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏥 Établissements</span>
                </div>
            `,
            'renouvellement': `
                 <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Pro</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🔄 KIIIMOOWOOR</span>
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
    window.professionnelJourney = new ParcoursProfessionnelManager();
});

// Export for use in other modules
window.ParcoursProfessionnelManager = ParcoursProfessionnelManager;
