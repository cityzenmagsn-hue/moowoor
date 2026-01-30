// Parcours Patient JavaScript - Gestion du parcours patient interactif

class ParcoursPatientManager {
    constructor() {
        this.journeySteps = [
            {
                id: 'inspection',
                title: 'Inscription',
                description: 'Pré-admission via app/web, choix établissement, premier RDV',
                icon: '📝',
                modules: ['FIIIMOOWOOR', 'KIIIMOOWOOR'],
                details: {
                    process: 'Le patient s\'inscrit via l\'application mobile ou le portail web, choisit son établissement et prend son premier rendez-vous.',
                    benefits: ['Inscription simplifiée', 'Choix de l\'établissement', 'Planification autonome'],
                    duration: '5-10min',
                    documents: ['Pièce d\'identité', 'Informations de contact', 'Dossier préliminaire']
                }
            },
            {
                id: 'consultation',
                title: 'Consultation',
                description: 'Examen médical, accès historique, mise à jour dossier',
                icon: '👨‍⚕️',
                modules: ['VACCEC', 'KIIIMOOWOOR'],
                details: {
                    process: 'Le médecin effectue l\'examen médical, consulte l\'historique du patient et met à jour le dossier en temps réel.',
                    benefits: ['Accès instantané à l\'historique', 'Support à la décision', 'Gain de temps administratif'],
                    duration: '20-30min',
                    documents: ['Dossier médical', 'Constantes', 'Observations cliniques']
                }
            },
            {
                id: 'diagnostic',
                title: 'Diagnostic',
                description: 'Prescription analyses, examens complémentaires',
                icon: '🔬',
                modules: ['VACCEC Lab', 'VACCEC'],
                details: {
                    process: 'Prescription et réalisation des examens complémentaires (biologie, imagerie) avec intégration automatique des résultats.',
                    benefits: ['Demandes dématérialisées', 'Réception rapide des résultats', 'Traçabilité des échantillons'],
                    duration: '30min-2h',
                    documents: ['Ordonnance d\'examens', 'Résultats d\'analyses', 'Compte-rendu imagerie']
                }
            },
            {
                id: 'traitement',
                title: 'Traitement',
                description: 'Prescription médicaments, validation AMM, dispensation',
                icon: '💊',
                modules: ['Pharmacie Sénégal', 'INASANI RAMA'],
                details: {
                    process: 'Prescription électronique des médicaments, vérification de l\'AMM et dispensation sécurisée en pharmacie.',
                    benefits: ['Sécurité de la prescription', 'Contrôle des interactions', 'Disponibilité garantie'],
                    duration: '10-20min',
                    documents: ['Ordonnance électronique', 'Plan de traitement', 'Conseils pharmacien']
                }
            },
            {
                id: 'suivi',
                title: 'Suivi',
                description: 'Planification rendez-vous suivi, monitoring distance',
                icon: '📅',
                modules: ['VACCEC', 'Mobile App'],
                details: {
                    process: 'Organisation du suivi médical, planification des prochains rendez-vous et télésurveillance si nécessaire.',
                    benefits: ['Continuité des soins', 'Rappels automatiques', 'Détection précoce des complications'],
                    duration: 'Continu',
                    documents: ['Calendrier de suivi', 'Données de télésurveillance', 'Rapports d\'évolution']
                }
            },
            {
                id: 'facturation',
                title: 'Facturation',
                description: 'Calcul automatique, application couverture, paiement',
                icon: '💰',
                modules: ['VACCEC', 'Medical Coverage'],
                details: {
                    process: 'Génération automatique de la facture, application des règles de prise en charge et encaissement sécurisé.',
                    benefits: ['Transparence des coûts', 'Réduction des erreurs', 'Paiement facilité'],
                    duration: '5-10min',
                    documents: ['Facture détaillée', 'Reçu de paiement', 'Bordereau de transmission']
                }
            },
            {
                id: 'couverture',
                title: 'Couverture',
                description: 'Vérification droits CMU/assurance, remboursement',
                icon: '🛡️',
                modules: ['Medical Coverage'],
                details: {
                    process: 'Vérification en temps réel des droits de l\'assuré et télétransmission pour le remboursement.',
                    benefits: ['Tiers payant intégral', 'Remboursement accéléré', 'Gestion administrative allégée'],
                    duration: 'Instantané',
                    documents: ['Carte d\'assuré', 'Demande de remboursement', 'Accord de prise en charge']
                }
            },
            {
                id: 'feedback',
                title: 'Feedback',
                description: 'Évaluation expérience, suggestions amélioration',
                icon: '⭐',
                modules: ['VACCEC'],
                details: {
                    process: 'Recueil de l\'avis du patient sur son parcours de soins et ses suggestions d\'amélioration.',
                    benefits: ['Amélioration continue', 'Mesure de la satisfaction', 'Engagement patient'],
                    duration: '2-5min',
                    documents: ['Questionnaire de satisfaction', 'Avis vérifié', 'Suggestions']
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
        const container = document.getElementById('patientTimeline');
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
                            <button class="step-details-btn" onclick="parcoursPatient.showStepDetails('${step.id}')">
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
                    <h4>Intégration et Flux de Données</h4>
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
        // Logique simplifiée pour l'affichage des intégrations
        // À adapter selon la complexité désirée
        const integrationMap = {
            'inspection': `
                <div class="integration-item">
                    <span class="integration-from">👤 Patient</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏥 FIIIMOOWOOR</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🏥 FIIIMOOWOOR</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">👨‍⚕️ KIIIMOOWOOR</span>
                </div>
            `,
            'consultation': `
                 <div class="integration-item">
                    <span class="integration-from">🏥 Dossier</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">👨‍⚕️ VACCEC</span>
                </div>
            `,
            'diagnostic': `
                 <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Prescription</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🔬 VACCEC Lab</span>
                </div>
            `,
            'traitement': `
                 <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Ordonnance</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">💊 Pharmacie</span>
                </div>
            `,
            'suivi': `
                 <div class="integration-item">
                    <span class="integration-from">🏥 VACCEC</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📱 App Patient</span>
                </div>
            `,
            'facturation': `
                 <div class="integration-item">
                    <span class="integration-from">🏥 Actes</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">💰 Facturation</span>
                </div>
            `,
            'couverture': `
                 <div class="integration-item">
                    <span class="integration-from">💰 Facture</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🛡️ Assurance</span>
                </div>
            `,
            'feedback': `
                 <div class="integration-item">
                    <span class="integration-from">👤 Patient</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">⭐ Qualité</span>
                </div>
            `
        };
        return integrationMap[step.id] || '<p>Intégration standard via le bus de données Moowoor.</p>';
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
    window.parcoursPatient = new ParcoursPatientManager();
});

// Export for use in other modules
window.ParcoursPatientManager = ParcoursPatientManager;
