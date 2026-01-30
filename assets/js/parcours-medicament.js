// Parcours Médicament JavaScript - Gestion du parcours médicament interactif

class ParcoursMedicamentManager {
    constructor() {
        this.medicineSteps = [
            {
                id: 'amm-request',
                title: 'Demande AMM',
                description: 'Dépôt dossier complet',
                icon: '📋',
                modules: ['INASANI AMM', 'INASANI Base'],
                details: {
                    process: 'Le laboratoire soumet une demande d\'AMM avec un dossier complet (administratif, pharmaceutique, clinique) pour évaluation.',
                    benefits: ['Dépôt dématérialisé', 'Vérification automatique de complétude', 'Accusé de réception immédiat'],
                    duration: '30-45 jours',
                    documents: ['Dossier AMM', 'Echantillons', 'Dossier Technique']
                }
            },
            {
                id: 'evaluation',
                title: 'Évaluation',
                description: 'Analyse scientifique qualité/efficacité/sécurité',
                icon: '🔬',
                modules: ['INASANI AMM', 'INASANI Evaluation'],
                details: {
                    process: 'Les experts évaluent le dossier selon des critères scientifiques rigoureux pour garantir la qualité, la sécurité et l\'efficacité du médicament.',
                    benefits: ['Évaluation multicritère', 'Traçabilité des avis', 'Respect des délais réglementaires'],
                    duration: '60-90 jours',
                    documents: ['Rapports d\'évaluation', 'Demandes de compléments', 'Avis de la commission']
                }
            },
            {
                id: 'autorisation',
                title: 'Autorisation',
                description: 'Délivrance AMM après évaluation positive',
                icon: '✅',
                modules: ['INASANI AMM', 'INASANI RAMA'],
                details: {
                    process: 'En cas d\'avis favorable, l\'AMM est accordée et un numéro d\'enregistrement unique est généré.',
                    benefits: ['Génération automatique du certificat', 'Notification instantanée', 'Mise à jour de la base de données'],
                    duration: '15-30 jours',
                    documents: ['Certificat AMM', 'RCP validé', 'Notice validée']
                }
            },
            {
                id: 'rama-registration',
                title: 'Enregistrement RAMA',
                description: 'Inscription registre national, génération QR code',
                icon: 'NP',
                modules: ['INASANI RAMA', 'INASANI QRCode'],
                details: {
                    process: 'Le médicament est inscrit au Registre des MEdicaments Autorisés (RAMA) et un QR code unique est généré pour chaque conditionnement.',
                    benefits: ['Référentiel unique national', 'Sécurisation par QR code', 'Accessibilité publique'],
                    duration: '7-15 jours',
                    documents: ['Fiche RAMA', 'QR Codes', 'Fiche de prix']
                }
            },
            {
                id: 'distribution',
                title: 'Distribution',
                description: 'Mise sur marché, traçabilité lots',
                icon: '🚚',
                modules: ['Pharmacie Sénégal', 'INASANI Tracking'],
                details: {
                    process: 'Le médicament est distribué aux grossistes et officines avec un suivi strict des lots et des conditions de conservation.',
                    benefits: ['Traçabilité de bout en bout', 'Gestion des retraits de lots', 'Surveillance des stocks'],
                    duration: 'Continu',
                    documents: ['Bons de livraison', 'Certificats de libération de lot', 'Relevés de température']
                }
            },
            {
                id: 'vente',
                title: 'Vente',
                description: 'Dispensation pharmacie, validation ordonnance',
                icon: '💊',
                modules: ['Pharmacie Sénégal', 'VACCEC'],
                details: {
                    process: 'Le pharmacien dispense le médicament au patient après validation de l\'ordonnance et vérification des contre-indications.',
                    benefits: ['Sécurisation de la délivrance', 'Dossier pharmaceutique', 'Conseil au patient'],
                    duration: '5-10min',
                    documents: ['Ordonnance', 'Feuille de soins', 'Ticket de caisse']
                }
            },
            {
                id: 'tracabilite',
                title: 'Traçabilité',
                description: 'Scan QR code, vérification authenticité',
                icon: '📱',
                modules: ['INASANI QRCode'],
                details: {
                    process: 'Vérification instantanée de l\'authenticité du médicament et de son statut (rappel, péremption) par scan du QR code.',
                    benefits: ['Lutte contre la contrefaçon', 'Information patient', 'Vérification instantanée'],
                    duration: 'Instantané',
                    documents: ['Preuve d\'authenticité', 'Notice patient dématérialisée']
                }
            },
            {
                id: 'pharmacovigilance',
                title: 'Pharmacovigilance',
                description: 'Surveillance effets indésirables',
                icon: '🔍',
                modules: ['INASANI Pharmacovigilance', 'VACCEC'],
                details: {
                    process: 'Collecte et analyse des signalements d\'effets indésirables pour réévaluer en continu le rapport bénéfice/risque.',
                    benefits: ['Surveillance post-marketing', 'Détection de signaux', 'Sécurité sanitaire'],
                    duration: 'Continu',
                    documents: ['Fiche de déclaration', 'Rapport périodique', 'Alerte sanitaire']
                }
            },
            {
                id: 'renouvellement',
                title: 'Renouvellement',
                description: 'Renouvellement AMM périodique',
                icon: '🔄',
                modules: ['INASANI AMM'],
                details: {
                    process: 'Réévaluation périodique du dossier d\'AMM pour confirmer le maintien de l\'autorisation.',
                    benefits: ['Mise à jour des données', 'Réévaluation sécurité', 'Pérennité de l\'autorisation'],
                    duration: 'Annuel',
                    documents: ['Dossier de renouvellement', 'Données de pharmacovigilance', 'Certificat renouvelé']
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
        const container = document.getElementById('medicamentTimeline');
        if (!container) return;

        container.innerHTML = `
            <div class="timeline-container">
                ${this.medicineSteps.map((step, index) => `
                    <div class="timeline-step scroll-animate" data-step-id="${step.id}" style="animation-delay: ${index * 0.1}s">
                        <div class="step-connector ${index === this.medicineSteps.length - 1 ? 'last' : ''}"></div>
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
                            <button class="step-details-btn" onclick="medicineJourney.showStepDetails('${step.id}')">
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showStepDetails(stepId) {
        const step = this.medicineSteps.find(s => s.id === stepId);
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
                    <h4>Points de Contrôle Qualité</h4>
                    <div class="quality-checks">
                        ${this.getQualityChecks(step)}
                    </div>
                </div>
            </div>
        `;

        const isAlreadyOpen = modal.classList.contains('active');
        if (!isAlreadyOpen) {
            this.previousActiveElement = document.activeElement;
        }

        this.currentStepIndex = this.medicineSteps.findIndex(s => s.id === stepId);

        modal.classList.add('active');

        const closeBtn = document.getElementById('modalClose');
        if (closeBtn) {
            closeBtn.focus();
        }
    }

    getQualityChecks(step) {
        // Logique simplifiée pour les contrôles qualité
        const checksMap = {
            'amm-request': [
                { check: 'Complétude dossier', status: 'required' },
                { check: 'Conformité administrative', status: 'required' }
            ],
            'evaluation': [
                { check: 'Expertise scientifique', status: 'critical' },
                { check: 'Rapport bénéfice/risque', status: 'critical' }
            ],
            'autorisation': [
                { check: 'Validation finale', status: 'critical' },
                { check: 'Signature officielle', status: 'required' }
            ],
            'rama-registration': [
                { check: 'Unicité code RAMA', status: 'critical' },
                { check: 'Vérification prix', status: 'required' }
            ],
            'distribution': [
                { check: 'Respect chaîne froid', status: 'critical' },
                { check: 'Intégrité emballage', status: 'required' }
            ],
            'vente': [
                { check: 'Validité ordonnance', status: 'critical' },
                { check: 'Absence contre-indication', status: 'critical' }
            ],
            'tracabilite': [
                { check: 'Authenticité QR', status: 'critical' },
                { check: 'Statut du lot', status: 'critical' }
            ],
            'pharmacovigilance': [
                { check: 'Validation signalement', status: 'required' },
                { check: 'Analyse imputabilité', status: 'critical' }
            ],
            'renouvellement': [
                { check: 'Bilan périodique', status: 'required' },
                { check: 'Maintien conformité', status: 'critical' }
            ]
        };

        const checks = checksMap[step.id] || [];
        return checks.map(item => `
            <div class="quality-check-item">
                <div class="check-status ${item.status}">${item.status === 'critical' ? '🔴' : '🟡'}</div>
                <span class="check-label">${item.check}</span>
            </div>
        `).join('');
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
        if (newIndex >= 0 && newIndex < this.medicineSteps.length) {
            this.showStepDetails(this.medicineSteps[newIndex].id);
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
    window.medicineJourney = new ParcoursMedicamentManager();
});

// Export for use in other modules
window.ParcoursMedicamentManager = ParcoursMedicamentManager;
