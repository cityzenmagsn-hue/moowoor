// Medicine Journey JavaScript - Gestion du parcours médicament interactif

class MedicineJourneyManager {
    constructor() {
        this.medicineSteps = [
            {
                id: 'amm-request',
                title: 'Demande AMM',
                description: 'Dépôt de la demande d\'Autorisation de Mise sur le Marché',
                icon: '📋',
                modules: ['INASANI AMM', 'INASANI Base'],
                details: {
                    process: 'Le laboratoire pharmaceutique dépose une demande d\'AMM complète avec tous les documents requis pour l\'évaluation.',
                    benefits: ['Dépôt en ligne', 'Suivi en temps réel', 'Documentation assistée'],
                    duration: '30-45 jours',
                    documents: ['Dossier AMM', 'Résultats analytiques', 'Études cliniques', 'BPF']
                }
            },
            {
                id: 'evaluation',
                title: 'Évaluation Scientifique',
                description: 'Analyse du dossier par les experts réglementaires',
                icon: '🔬',
                modules: ['INASANI AMM', 'INASANI Evaluation'],
                details: {
                    process: 'Les experts évaluent la qualité, l\'efficacité et la sécurité du médicament selon les normes internationales.',
                    benefits: ['Évaluation standardisée', 'Expertise locale', 'Transparence du processus'],
                    duration: '60-90 jours',
                    documents: ['Rapport d\'évaluation', 'Recommandations', 'Demande d\'informations complémentaires']
                }
            },
            {
                id: 'inspection',
                title: 'Inspection des Sites',
                description: 'Vérification des installations de production',
                icon: '🏭',
                modules: ['INASANI Inspection', 'INASANI PV'],
                details: {
                    process: 'Inspection des sites de production pour vérifier la conformité avec les Bonnes Pratiques de Fabrication.',
                    benefits: ['Contrôle visuel', 'Validation BPF', 'Rapport détaillé'],
                    duration: '5-10 jours par site',
                    documents: ['Rapport d\'inspection', 'Plan d\'action', 'Certificat de conformité']
                }
            },
            {
                id: 'amm-grant',
                title: 'Octroi AMM',
                description: 'Délivrance de l\'Autorisation de Mise sur le Marché',
                icon: '✅',
                modules: ['INASANI AMM', 'INASANI RAMA'],
                details: {
                    process: 'Après évaluation positive, l\'AMM est délivrée avec conditions spécifiques et durée de validité.',
                    benefits: ['Autorisation officielle', 'Conditions claires', 'Suivi post-AMM'],
                    duration: '15-30 jours',
                    documents: ['Certificat AMM', 'Résumé des caractéristiques', 'Conditions de mise sur le marché']
                }
            },
            {
                id: 'price-regulation',
                title: 'Fixation des Prix',
                description: 'Détermination des prix publics réglementés',
                icon: '💰',
                modules: ['INASANI RAMA', 'INASANI Pricing'],
                details: {
                    process: 'Le ministère fixe les prix publics en fonction des coûts, de la valeur thérapeutique et des politiques de santé.',
                    benefits: ['Prix justifié', 'Accessibilité', 'Transparence'],
                    duration: '30-45 jours',
                    documents: ['Arrêté de prix', 'Grille tarifaire', 'Justification économique']
                }
            },
            {
                id: 'rama-registration',
                title: 'Inscription RAMA',
                description: 'Enregistrement dans le Registre National des Médicaments',
                icon: '📖',
                modules: ['INASANI RAMA', 'INASANI QRCode'],
                details: {
                    process: 'Le médicament est officiellement enregistré dans le RAMA avec génération de QR code pour traçabilité.',
                    benefits: ['Registre officiel', 'QR code unique', 'Accès public'],
                    duration: '7-15 jours',
                    documents: ['Certificat RAMA', 'QR code', 'Fiche d\'information publique']
                }
            },
            {
                id: 'distribution',
                title: 'Distribution',
                description: 'Mise sur le marché et distribution aux pharmacies',
                icon: '🚚',
                modules: ['Pharmacie Sénégal', 'INASANI Tracking'],
                details: {
                    process: 'Le médicament est distribué dans le réseau national avec traçabilité complète des lots.',
                    benefits: ['Traçabilité des lots', 'Contrôle qualité', 'Gestion des stocks'],
                    duration: 'Continu',
                    documents: ['Bon de livraison', 'Traçabilité lot', 'Certificat de distribution']
                }
            },
            {
                id: 'dispensation',
                title: 'Dispensation',
                description: 'Délivrance au patient avec validation automatique',
                icon: '💊',
                modules: ['Pharmacie Sénégal', 'VACCEC'],
                details: {
                    process: 'Le pharmacien délivre le médicament après validation de l\'ordonnance et vérification du QR code.',
                    benefits: ['Validation automatique', 'Sécurité patient', 'Traçabilité finale'],
                    duration: '5-10 minutes',
                    documents: ['Ordonnance validée', 'QR code vérifié', 'Reçu de dispensation']
                }
            },
            {
                id: 'pharmacovigilance',
                title: 'Pharmacovigilance',
                description: 'Surveillance des effets indésirables post-AMM',
                icon: '🔍',
                modules: ['INASANI Pharmacovigilance', 'VACCEC'],
                details: {
                    process: 'Surveillance continue des effets secondaires et actions correctives si nécessaire.',
                    benefits: ['Sécurité continue', 'Alertes rapides', 'Actions correctives'],
                    duration: 'Continu',
                    documents: ['Déclaration d\'effet', 'Rapport de pharmacovigilance', 'Mise à jour AMM']
                }
            }
        ];
        this.init();
    }

    init() {
        this.renderTimeline();
        this.setupModal();
        this.animateTimeline();
    }

    renderTimeline() {
        const container = document.getElementById('medicineTimeline');
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
                    <h4>Bénéfices du Système</h4>
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
                    <h4>Intégration Réglementaire</h4>
                    <div class="step-integration">
                        <div class="integration-flow-mini">
                            ${this.getStepIntegration(step)}
                        </div>
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

        modal.classList.add('active');
    }

    getStepIntegration(step) {
        const integrationMap = {
            'amm-request': `
                <div class="integration-item">
                    <span class="integration-from">🏢 Laboratoire</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📋 INASANI AMM</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">📋 INASANI AMM</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🗃️ INASANI Base</span>
                </div>
            `,
            'evaluation': `
                <div class="integration-item">
                    <span class="integration-from">📋 Demande AMM</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🔬 Experts Évaluateurs</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🔬 Évaluation</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📊 INASANI Evaluation</span>
                </div>
            `,
            'inspection': `
                <div class="integration-item">
                    <span class="integration-from">🔬 Évaluation</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏭 Site Production</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🏭 Inspection</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📝 INASANI PV</span>
                </div>
            `,
            'amm-grant': `
                <div class="integration-item">
                    <span class="integration-from">🔬 Évaluation Positive</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">✅ Autorité Réglementaire</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">✅ AMM Accordée</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📖 INASANI RAMA</span>
                </div>
            `,
            'price-regulation': `
                <div class="integration-item">
                    <span class="integration-from">✅ AMM Accordée</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">💰 Ministre Économie</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">💰 Prix Fixé</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📖 INASANI RAMA</span>
                </div>
            `,
            'rama-registration': `
                <div class="integration-item">
                    <span class="integration-from">💰 Prix Validé</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📖 INASANI RAMA</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">📖 RAMA</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📱 INASANI QRCode</span>
                </div>
            `,
            'distribution': `
                <div class="integration-item">
                    <span class="integration-from">📖 RAMA Enregistré</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🚚 Distributeur</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🚚 Distribution</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">💊 Pharmacie Sénégal</span>
                </div>
            `,
            'dispensation': `
                <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Ordonnance</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">💊 Pharmacien</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">💊 Validation</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📱 QR Code Scanné</span>
                </div>
            `,
            'pharmacovigilance': `
                <div class="integration-item">
                    <span class="integration-from">💊 Patient</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏥 Professionnel Santé</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🏥 Déclaration</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🔍 INASANI Pharmacovigilance</span>
                </div>
            `
        };
        return integrationMap[step.id] || '';
    }

    getQualityChecks(step) {
        const checksMap = {
            'amm-request': [
                { check: 'Complétude dossier', status: 'required' },
                { check: 'Format conforme', status: 'required' },
                { check: 'Documents signés', status: 'required' }
            ],
            'evaluation': [
                { check: 'Qualité pharmaceutique', status: 'critical' },
                { check: 'Efficacité thérapeutique', status: 'critical' },
                { check: 'Sécurité d\'emploi', status: 'critical' },
                { check: 'Bénéfice/risque', status: 'critical' }
            ],
            'inspection': [
                { check: 'BPF respectées', status: 'critical' },
                { check: 'Hygiène', status: 'required' },
                { check: 'Personnel qualifié', status: 'required' },
                { check: 'Documentation', status: 'required' }
            ],
            'amm-grant': [
                { check: 'Évaluation favorable', status: 'critical' },
                { check: 'Inspection conforme', status: 'critical' },
                { check: 'Prix fixé', status: 'required' },
                { check: 'Conditions acceptées', status: 'required' }
            ],
            'price-regulation': [
                { check: 'Coûts justifiés', status: 'critical' },
                { check: 'Valeur thérapeutique', status: 'required' },
                { check: 'Accessibilité', status: 'required' },
                { check: 'Viabilité économique', status: 'required' }
            ],
            'rama-registration': [
                { check: 'AMM valide', status: 'critical' },
                { check: 'Prix réglementé', status: 'critical' },
                { check: 'QR code unique', status: 'required' },
                { check: 'Informations publiques', status: 'required' }
            ],
            'distribution': [
                { check: 'Traçabilité lot', status: 'critical' },
                { check: 'Conditions transport', status: 'required' },
                { check: 'Stockage sécurisé', status: 'required' },
                { check: 'Documentation transport', status: 'required' }
            ],
            'dispensation': [
                { check: 'Ordonnance valide', status: 'critical' },
                { check: 'QR code vérifié', status: 'critical' },
                { check: 'Lot enregistré', status: 'required' },
                { check: 'Patient identifié', status: 'required' }
            ],
            'pharmacovigilance': [
                { check: 'Effet indésirable', status: 'critical' },
                { check: 'Gravité évaluée', status: 'critical' },
                { check: 'Action corrective', status: 'required' },
                { check: 'Suivi patient', status: 'required' }
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
        const modal = document.getElementById('stepModal');
        modal.classList.remove('active');
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
    window.medicineJourney = new MedicineJourneyManager();
});

// Export for use in other modules
window.MedicineJourneyManager = MedicineJourneyManager;